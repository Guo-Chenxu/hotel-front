<template>
    <div class="user-main">
        <img src="../assets/userview.png" style="margin-left:130px;margin-right:-100px;width: 100%; height: 100%; opacity: 0.5;">
        <div class="rectangle">
            <div class="rectangle1">
                <h1></h1>
                <h2 class="cook">尊敬的会员</h2>
                <h2 class="cook1">欢迎来到波普特</h2>
                <h2 class="cook1">绿色酒店</h2>
            </div>
            <div class="rectangle2">
                <h2 class="attentions">注意事项</h2>
                <h2 class="attentions1">1. 如有查看订单的需要请在线上或到前台查询</h2>
                <h2 class="attentions1">2. 本店资源有限，请爱护空调等电子设备</h2>
                <h2 class="attentions1">3. 请在纳凉人员在的时候尽可能提出需求</h2>
                <h2 class="attentions1">4. 如有点餐需求请在线上直接进行点单</h2>
                <h2 class="attentions1">5. 本店提倡友好服务，请尊重工作人员</h2>
                <h2 class="attentions1">6. 工作人员态度恶劣可到前台处举报</h2>
                <h2 class="attentions1">7. 如有纳凉需要请向前台提出申请</h2>
                <h2 class="attentions1">8. 祝您入住愉快</h2>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    name: 'UserMain',
}
</script>

<style scoped>
.user-main {
    background-size: cover;
    background-position: center;
    font-family: 'Roboto', sans-serif;
    text-align: center;
    color: #ffffff;
    overflow: hidden;
    height: 100vh;
    width: 100%;
    margin-top:-20px;
    margin-left:-6px;
    
}
.rectangle {
    margin-top: -52%;
    margin-left: 40vh;
    margin-right: 20vh;
    height: 80.5vh;
    width: 125vh;
    align-items: center;
    background-color: #c0e1ea;
    display: flex;
    justify-content: space-between;
}
.rectangle1 {
    width: 57vh;
    height: 70vh;
    background-color: #e6f0f430;
    margin-left: 5vh;
    position: relative;
    z-index: 10;
}
.rectangle2 {
    width: 57vh;
    height: 70vh;
    background-color:#e6f0f430;
    margin-right: 5vh;
    position: relative;
    z-index: 10;
}
h1 {
    text-align: left;
    margin-left: 3vh;
}
.cook{
    margin-top:8vh;
    font-size: 6vh;
    color: #ffffffd3;
}
.cook1 {
    margin-top: 5vh;
    font-size: 6vh;
    color: #ffffffd3;
}
.attentions{
    margin-top: 7vh;
    margin-left: 3vh;
    margin-bottom: 7vh;
    font-size: 3.5vh;
}
.attentions1 {
    margin-top: 2vh;
    text-align: left;
    font-size: 2.4vh;
    margin-left: 5vh;
}
</style>