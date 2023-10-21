<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GET, POST, API_URL } from '../scripts/web_helper';
import { GameStatus, Objective } from '../scripts/types';
import { useRoute, useRouter } from 'vue-router';

let game_status = ref<GameStatus>({
    status: false,
    end_time: 0,
    total_score: 0,
    objectives: [],
    rejected: [],
    text: undefined
});
let time_left_display = ref("Waiting to start..."); 
let objectives_display = ref<Objective[]>([]);
let completed_objectives = ref<Objective[]>([]);

onMounted(async () => {
    let total_objectives = await GET(API_URL + "/api/objectives");
    game_status.value = await GET(API_URL + "/api/objectives/" + group_name);
    let objectives = total_objectives.objectives;
    for(let objective_index in objectives) {
        let objective = {
            id: objectives[objective_index].id,
            description: objectives[objective_index].description,
            title: objectives[objective_index].title,
            score: objectives[objective_index].score,
            rejected: game_status.value.rejected.includes(objectives[objective_index].id),
            completed: game_status.value.objectives.includes(objectives[objective_index].id) && !game_status.value.rejected.includes(objectives[objective_index].id)
        };
        objectives_display.value.push(objective);
        if(objective.completed)
            completed_objectives.value.push(objective);
    }
    if(game_status.value.status)
        start_timer();
});

const route = useRoute()
const router = useRouter();
const group_name: string | string[] = route.params.group_name;

function seconds_to_timer(seconds: number) {
    var hours_place = Math.floor(seconds/3600);
    var minutes_place = Math.floor((seconds - hours_place * 3600)/60);
    var seconds_place = seconds - hours_place*3600 - minutes_place*60;
    return `${hours_place.toString().padStart(2, '0')}:${minutes_place.toString().padStart(2, '0')}:${seconds_place.toString().padStart(2, '0')}`;
}

async function open_camera(objective_id: number) {
    if(time_left <= 0)
        return;

    let objective = objectives_display.value.find(objective => objective.id === objective_id);
    if(objective) {
        objective.uploading = true;
    }
    const take_photo = async () => {
        const image = await Camera.getPhoto({
            quality: 70,
            source: CameraSource.Camera,
            resultType: CameraResultType.Base64
        }).catch((e) => {
            objective = objectives_display.value.find(objective => objective.id === objective_id);
            if(objective) {
                objective.uploading = false;
            }
            
            throw new Error(e);
        });;
        let image_data = image.base64String;
        let post_data = {
            group_name: group_name,
            objective_id: objective_id,
            timestamp: Date.now(),
            image_data: image_data
        };
        let result = await POST(API_URL + "/api/post", post_data);
        console.log(result);
        objective = objectives_display.value.find(objective => objective.id === objective_id);
        if(objective) {
            objective.completed = true;
            objective.uploading = false;
        }
        request_update();
    };
    await take_photo();
}

function get_objective_icon(objective: Objective) {
    if(objective.completed)
        return "/assets/checkmark-outline.svg";
    else if(objective.rejected)
        return "/assets/close-outline.svg";
    else if(time_left > 0)
        return "/assets/camera-outline.svg";
    else
        return "";
}

var time_left = 10800;
var timerInterval: NodeJS.Timer;
var time_started = false;
function start_timer() {
    if(time_started)
        return;
    time_started = true;

    let time_offset = game_status.value.end_time - Date.now();
    time_offset /= 1000;
    time_offset = Math.round(time_offset);
    time_offset = Math.max(time_offset, 0);

    time_left = time_offset;

    timerInterval = setInterval(function () {
        time_left--;
        time_left_display.value = seconds_to_timer(time_left);
        if(time_left <= 0)
            clearInterval(timerInterval);
    }, 1000);
}


async function request_update() {
    let total_objectives = await GET(API_URL + "/api/objectives");
    let response_json = await GET(API_URL + "/api/objectives/" + group_name);
    game_status.value = response_json;
    
    console.log("RESPONSE: " + JSON.stringify(game_status.value.text))
    if(game_status.value == undefined || game_status.value.text != undefined) {
        router.push("/");
        clearInterval(syncInterval);
        return;
    }

    let objectives = total_objectives.objectives;

    let temp_objectives_display = [];
    let temp_completed_objectives = [];
    var i = 0;
    for(let objective_index in objectives) {
        let objective = {
            id: objectives[objective_index].id,
            description: objectives[objective_index].description,
            title: objectives[objective_index].title,
            score: objectives[objective_index].score,
            rejected: game_status.value.rejected.includes(objectives[objective_index].id),
            completed: game_status.value.objectives.includes(objectives[objective_index].id) && !game_status.value.rejected.includes(objectives[objective_index].id),
            uploading: objectives_display.value[i].uploading
        };
        temp_objectives_display.push(objective);
        if(objective.completed)
            temp_completed_objectives.push(objective);

        i++;
    }
    objectives_display.value = temp_objectives_display;
    completed_objectives.value = temp_completed_objectives;

    let time_offset = game_status.value.end_time - Date.now();
    time_offset /= 1000;
    time_offset = Math.round(time_offset);
    time_offset = Math.max(time_offset, 0);

    time_left = time_offset;
}

// SYNC WITH SERVER
var syncInterval = setInterval(async function () {
    request_update();

    if(game_status.value.status)
        start_timer();
}, 5000);

</script>

<template>
    <h2>{{ group_name }}</h2>
    <h1 class="count-down">{{ time_left_display }}</h1>
    <div v-if="time_started" class="objectives">
        <div class="header">
            <h3 class="label">Objectives ({{ completed_objectives.length }}/{{ objectives_display.length}})</h3>
            <h3 class="label-right">Score: {{ game_status.total_score }}</h3>
        </div>
        <div class="objective" :class="{ rejected: objective.rejected, incomplete: !objective.completed, complete: objective.completed }" v-for="objective in objectives_display" @click="open_camera(objective.id)">
            <div v-if="!objective.completed" :class="{ score: true, 'score-rejected': objective.rejected}">
                <h4 class="score-text">+{{ objective.score }}</h4>
            </div>
            <div class="info">
                <h4 class="objective-title">{{ objective.title }}</h4>
                <p class="description">{{ objective.description }}</p>
            </div>
            <div class="preview">
                <img v-if="!objective.uploading" class="icon" :class="{ 'complete-icon': objective.completed, 'rejected-icon': objective.rejected }" :src="get_objective_icon(objective)" />
                <div v-if="objective.uploading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.complete-icon {
    filter: invert(29%) sepia(27%) saturate(998%) hue-rotate(69deg) brightness(99%) contrast(87%);
}

.rejected-icon {
    filter: invert(9%) sepia(94%) saturate(4743%) hue-rotate(357deg) brightness(113%) contrast(113%);
}

.complete {
    border-color: #30632e;
    color: #30632e;
}
.incomplete {
    border-color: #213547;
}
.rejected {
    border-color: #c90000;
    color: #ad3535;
}
.description {
    font-size: small;
    line-height: 15px;
    margin-bottom: 0;
}
.objective-title {
    margin-bottom: 0;
}
.label {
    text-align: left;
    float:left;
    line-height: 1px;
}
.label-right {
    text-align: right;
    float:right;
    line-height: 1px;
}

.count-down {
    display: block;
}

.info {
    float:left;
    padding-left: 10px;
    max-width: 65%;
}

.score-text {
    margin-top: 0px;
    margin-bottom: 0px;
}

.score {
    float:left;
    min-height: 5px;
    line-height: 85px;
    text-align: center;
    width: 30px;
    border-right-width: 2px;
    border-right-color: #48484877;
    border-right-style: solid;
    padding: 0 5px;
}
.score-rejected {
    border-right-color: #b96e6e;
}

.preview {
    float: right;
    min-width: 30px;
    min-height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
}

.objective {
    background-color: rgb(255, 255, 255);

    border-radius: 10px;
    border-style: solid;

    line-height: 4px;
    text-align: left;
    margin-bottom: 10px;
    box-sizing: border-box;  
    width: 100%;
    display: table;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 46px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #213547 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
