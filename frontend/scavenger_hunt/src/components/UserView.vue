<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GET, POST, API_URL } from '../scripts/web_helper';
import { GameStatus, Objective } from '../scripts/types';
import { useRoute, useRouter } from 'vue-router';

let game_status = ref<GameStatus>({
    status: false,
    objectives: [],
    text: undefined
});
let time_left_display = ref("Waiting to start..."); 
let objectives_display = ref<Objective[]>([]);

onMounted(async () => {
    let total_objectives = await GET(API_URL + "/api/objectives");
    game_status.value = await GET(API_URL + "/api/objectives/" + group_name);
    let objectives = total_objectives.objectives;
    for(let objective_index in objectives) {
        objectives_display.value.push({
            id: objectives[objective_index].id,
            description: objectives[objective_index].description,
            title: objectives[objective_index].title,
            completed: game_status.value.objectives.includes(objectives[objective_index].id)
        });
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

function open_camera(objective_id: number) {
    const take_photo = async () => {
        const image = await Camera.getPhoto({
            quality: 80,
            source: CameraSource.Camera,
            resultType: CameraResultType.Base64
        });
        let image_data = image.base64String;
        let post_data = {
            group_name: group_name,
            objective_id: objective_id,
            timestamp: Date.now(),
            image_data: image_data
        };
        let result = await POST(API_URL + "/api/post", post_data);
        console.log(result);
        let objective = objectives_display.value.find(objective => objective.id === objective_id);
        if(objective)
            objective.completed = true;
    };
    take_photo();
}

function get_objective_icon(state: boolean) {
    return state ? "/assets/checkmark-outline.svg" : "/assets/camera-outline.svg";
}

var time_left = 10800;
var timerInterval: NodeJS.Timer;
var time_started = false;
function start_timer() {
    if(time_started)
        return;
    time_started = true;
    timerInterval = setInterval(function () {
        time_left_display.value = seconds_to_timer(time_left);
        time_left--;
        if(time_left <= 0)
            clearInterval(timerInterval);
    }, 1000);
}


// SYNC WITH SERVER
var syncInterval = setInterval(async function () {
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
    for(let objective_index in objectives) {
        objectives_display.value.push({
            id: objectives[objective_index].id,
            description: objectives[objective_index].description,
            title: objectives[objective_index].title,
            completed: game_status.value.objectives.includes(objectives[objective_index].id)
        });
    }
    if(game_status.value.status)
        start_timer();
}, 5000);

</script>

<template>
    <h2>{{ group_name }}</h2>
    <h1 class="count-down">{{ time_left_display }}</h1>
    <div v-if="time_started" class="objectives">
        <h2 class="label">Objectives</h2>
        <div class="objective" :class="{ incomplete: !objective.completed, complete: objective.completed }" v-for="objective in objectives_display" @click="open_camera(objective.id)">
            <div class="info">
                <h3>{{ objective.title }}</h3>
                <p>{{ objective.description }}</p>
            </div>
            <div class="preview">
                <img class="icon" :class="{ 'complete-icon': objective.completed }" :src="get_objective_icon(objective.completed == undefined ? false : objective.completed)" />
            </div>
        </div>
        <!--<div class="complete objective">
            <div class="info">
                <h3>Fast Food Lane</h3>
                <p class="description">Take a picture of 3 burger joints in a row.</p>
            </div>
            <div class="preview">
                <img class="icon complete-icon" src="../assets/checkmark-outline.svg" />
            </div>
        </div>-->
    </div>
</template>

<style scoped>
.complete-icon {
    filter: invert(29%) sepia(27%) saturate(998%) hue-rotate(69deg) brightness(99%) contrast(87%);
}
.complete {
    border-color: #30632e;
    color: #30632e;
}
.incomplete {
    border-color: #213547;
    border-width: 1px;
}

.description {
    line-height: normal;
}

.label {
    text-align: left;
    line-height: 1px;
}

.count-down {
    display: block;
}

.info {
    float:left;
    min-height: 65px;
    max-width: 75%;
}

.preview {
    float: right;
    min-width: 30px;
    min-height: 65px;
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
    padding: 0 0 0 10px;
    margin-bottom: 10px;
    box-sizing: border-box;  
    width: 100%;
    display: table;
}
</style>
