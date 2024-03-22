<template>
    <div class="user-view">
        <div class="rectangle">
            <h1 class="title">服务列表</h1>
            <div class="rectangle1-container">
                <div class="rectangle1"></div>
                <div class="rectangle2"></div>
                <div class="rectangle5"></div>
            </div>
            <div class="rectangle1-container2">
                <div class="rectangle3"></div>
                <div class="rectangle4"></div>
            </div>
            <button>退订房间</button>
        </div>
    </div>
</template>


<script>

export default {
    name: 'UserLogin',
    data() {
        return {
            roomid: '',
            consumername: '',
            isLoggedIn: false
        }
    },
    methods: {
        
    }
}
</script>

<style scope>
.user-view {
    background-image: url('../assets/userview.png');
    background-size: cover;
    background-position-x: center;
    height: 100%;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
    margin-top: 0%;
    margin-bottom: 0%;
    overflow: hidden;
}
.rectangle {
    margin: 5% auto 4%;
    height: 750px;
    width: 1480px;
    background-color: #fafafa7b;
    border-radius: 20px;
}
.title {
    color: #7f7fd9b4;
    font-size: 70px;
    
}
.rectangle1-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1300px;
    margin: 0 auto;
    margin-top: -7%;
    position: relative;
}
.rectangle1-container2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 850px;
    margin: -5% auto;
    position: relative;
}
.rectangle1 {
    width: 400px;
    height: 370px;
    background-color: #d67e9a30;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 1;
}
.rectangle2 {
    width: 380px;
    height: 300px;
    background-color: #97bfdf51;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 5;
}
.rectangle5 {
    width: 400px;
    height: 450px;
    background-color: #457af430;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 1;
}
.rectangle3 {
    width: 400px;
    height: 300px;
    background-color: #caa17c3b;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 5;
}
.rectangle4 {
    width: 350px;
    height: 380px;
    background-color: #52dbbb3b;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    margin: -8% auto;
    z-index: 5;
}
.rectangle1:last-child {
    margin-right: 0;
}
button {
position: absolute;
    bottom: -21%;
    right: 8%;
    z-index: 10;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-right: 40px;
    padding-left: 40px;
    background-color: #fbf9f979;
    color: #022d19;
}
</style>
