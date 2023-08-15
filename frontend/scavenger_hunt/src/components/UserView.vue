<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GET, POST } from '../scripts/web_helper';
import { Objective } from '../scripts/types';
import { useRoute, useRouter } from 'vue-router';

let time_left_display = ref("Waiting to start..."); 
let objectives_display = ref<Objective[]>([]);

async function get_timer_status() {
    let response = await fetch("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/status");

    if (response.status == 502) {
        // Connection timed out. Reconnecting...
        await get_timer_status();
    } else if (response.status != 200 && response.status != 202) {
        console.log(response.statusText);

        // Internal error. Reconnecting...
        await new Promise(resolve => setTimeout(resolve, 1000));
        await get_timer_status();
    } else {
        // Timer started!
        let result = await response.text();
        console.log(result);
        start_timer();
    }
}

onMounted(async () => {
    let total_objectives = await GET("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/objectives");
    let completed_objectives = await GET("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/objectives/" + group_name);
    let objectives = total_objectives.objectives;
    for(let objective_index in objectives) {
        objectives_display.value.push({
            id: objectives[objective_index].id,
            description: objectives[objective_index].description,
            title: objectives[objective_index].title,
            completed: completed_objectives.includes(objectives[objective_index].id)
        });
    }

    get_timer_status();
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
        let result = await POST("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/post", post_data);
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
function start_timer() {
    timerInterval = setInterval(function () {
        time_left_display.value = seconds_to_timer(time_left);
        time_left--;
        if(time_left <= 0)
            clearInterval(timerInterval);
    }, 1000);
}


// SYNC WITH SERVER
var syncInterval = setInterval(async function () {
    let temp_objectives = []
    let total_objectives = await GET("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/objectives");
    let completed_objectives = await GET("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/objectives/" + group_name);
    
    if(completed_objectives.text != undefined) {
        router.push("/");
        clearInterval(syncInterval);
        return;
    }

    let objectives = total_objectives.objectives;
    for(let objective_index in objectives) {
        temp_objectives.push({
            id: objectives[objective_index].id,
            description: objectives[objective_index].description,
            title: objectives[objective_index].title,
            completed: completed_objectives.includes(objectives[objective_index].id)
        });
    }
    objectives_display.value = temp_objectives;
}, 5000);

</script>

<template>
    <h2>{{ group_name }}</h2>
    <h1 class="count-down">{{ time_left_display }}</h1>
    <h2 class="label">Objectives</h2>
    <div class="objectives">
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
