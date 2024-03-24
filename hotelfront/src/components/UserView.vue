<template>
    <div class="user-view">
        <div class="rectangle">
            <h1 class="title">服务列表</h1>
            <div class="rectangle1-container">
                <router-link to="/CustomerSnackView" class="router-link1">
                    <div class="rectangle1" :class="{ 'enlarge': isHover1 }" @mouseover="isHover1 = true"
                        @mouseleave="isHover1 = false">
                        <!-- <h2 class="cook">进行点餐</h2> -->
                        <img class="logo2" src="../assets/点餐_线性.png">
                        <h2 class="cook">进行点餐</h2>
                    </div>
                </router-link>
                <router-link to="/" class="router-link1">
                    <div class="rectangle2 " :class="{ 'enlarge': isHover2 }" @mouseover="isHover2 = true"
                        @mouseleave="isHover2 = false">
                        <img class="logo3" src="../assets/打扫.png">
                        <h2 class="clean">打扫卫生</h2>
                    </div>
                </router-link>
                <router-link to="/" class="router-link1">
                    <div class="rectangle5" :class="{ 'enlarge': isHover3 }" @mouseover="isHover3 = true"
                        @mouseleave="isHover3 = false">
                        <img class="logo1" src="../assets/空调.png">
                        <h2 class="cool">申请纳凉</h2>
                    </div>
                </router-link>
            </div>
            <div class="rectangle1-container2">
                <router-link to="/" class="router-link1">
                    <div class="rectangle3" :class="{ 'enlarge': isHover4 }" @mouseover="isHover4 = true"
                        @mouseleave="isHover4 = false">
                        <img class="logo4" src="../assets/订单.png">
                        <h2 class="detail">查看订单</h2>
                    </div>
                </router-link>
                <router-link to="/" class="router-link1">
                    <div class="rectangle4" :class="{ 'enlarge': isHover5 }" @mouseover="isHover5 = true"
                        @mouseleave="isHover5 = false">
                        <img class="logo5" src="../assets/更多.png">
                        <h2 class="more">更多服务</h2>
                    </div>
                </router-link>
            </div>
            <div class="log-out">
                <button @click="logout">退订房间</button>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    name: 'UserLogin',
    data() {
        return {
            isHover1: false,
            isHover2: false,
            isHover3: false,
            isHover4: false,
            isHover5: false,
        }
    },
    methods: {
        logout() {
            if (confirm('确定要登出吗？')) {
                this.$router.push('/');
            }
        }
    }
}
</script>

<style scoped>
.user-view {
    background-image: url('../assets/userview.png');
    background-size: cover;
    background-position-x: center;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
    overflow: hidden;
    height: 100%;
}
.rectangle {
    height: 80%;
    width: 88%;
    margin: 5% auto 10.4%;
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
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease, z-index 0s 0.3s;
}
.router-link1 {
    text-decoration: none;
    color: #ffffff;
}

.enlarge {
    transform: scale(1.1);
}

.rectangle2 {
    width: 380px;
    height: 300px;
    background-color: #97bfdf51;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 5;
    transition: transform 0.3s ease, z-index 0s 0.3s;
}
.rectangle5 {
    width: 400px;
    height: 450px;
    background-color: #457af430;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 1;
    transition: transform 0.3s ease, z-index 0s 0.3s;
}
.rectangle3 {
    width: 400px;
    height: 300px;
    background-color: #caa17c3b;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    z-index: 5;
    transition: transform 0.3s ease, z-index 0s 0.3s;
}
.rectangle4 {
    width: 350px;
    height: 370px;
    background-color: #52dbbb3b;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    margin: -9.5% auto;
    z-index: 5;
    transition: transform 0.3s ease, z-index 0s 0.3s;
}
.rectangle1:last-child {
    margin-right: 0;
}
.log-out {
    position: absolute;
    bottom: -21%;
    margin-bottom: 20%;
    right: 8%;
    z-index: 10;
}

button{
    border:none;
    background-color: #fbf9f979;
    color: #022d19;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-right: 40px;
    padding-left: 40px;
}
.cool {
    font-family: '华文宋体', sans-serif;
    margin-top: 10%;
    font-size: 40px;
    opacity: 0.88;
}
.cook {
    font-family: '华文宋体', monospace;
    margin-top: 10%;
    font-size: 40px;
}
.clean {
    font-family: '华文宋体', sans-serif;
    margin-top: 10%;
    font-size: 40px;
}
.detail {
    font-family: '华文宋体', sans-serif;
    margin-top: 5%;
    font-size: 40px;
}
.more {
    font-family: '华文宋体', sans-serif;
    margin-top: 10%;
    font-size: 40px;
}

.logo2 {
    margin-top: 29%;
    width: 125px;
    opacity: 0.6;
    height: auto;
}
.logo3 {
    margin-top: 12.5%;
    width: 125px;
    height: auto;
}
.logo1 {
    margin-top: 25%;
    width: 155px;
    opacity: 0.9;
    height: auto;
}
.logo4 {
    margin-top: 12%;
    width: 125px;
    opacity: 0.75;
    height: auto;
}
.logo5 {
    margin-top: 28%;
    width: 125px;
    opacity: 1;
    height: auto;
}
</style>
