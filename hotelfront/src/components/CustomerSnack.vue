<template>
    <div class="carousel-container">
      <h2 class="carousel-title">Welcome to Our Carousel</h2>
      <div class="carousel-inner" :style="{ 'transform': `translateX(-${currentIndex * (100 / 3)}%)` }">
        <div 
          class="carousel-item" 
          v-for="(item, index) in items" 
          :key="index"
          :class="{ 'active': index === currentIndex + 1, 'blur': index === currentIndex  || index === currentIndex + 2 }"
        >
          <div class="card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
      <p class="carousel-footer">Explore more with our carousel!</p>
      <button @click="prev" class="arrow arrow-left">&lt;</button>
      <button @click="next" class="arrow arrow-right">&gt;</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentIndex: 1, 
        items: [
          { title: 'High-End Restaurant', description: 'Offering a five-star dining experience' },
          { title: 'Homestyle Eatery', description: 'Comfortable family-style dining' },
          { title: 'Fast Food', description: 'Quick, convenient, and tasty' },
          { title: 'Dessert Shop', description: 'Exquisite desserts for a sweet life' },
          { title: 'Coffee House', description: 'Relax and enjoy the coffee moment' },

        ],
      };
    },
    methods: {
      next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
      },
      prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
      },
    },
  };
  </script>
  
  <style scoped>
  .carousel-container {
    overflow: hidden;
    width: 600px; 
    margin: 20px auto 0; 
    position: relative;
  }
  
  .carousel-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 100px;
  }
  
  .carousel-footer {
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
  }
  
  .carousel-inner {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }
  
  .carousel-item {
    width: 100%; 
    flex: 0 0 33.3333%; 
    display: flex;
    justify-content: center;
  }
  
  .card {
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin: 10px;
    padding: 20px;
    text-align: center;
    width: 80%;
    transition: transform 0.3s ease;
  }
  
  .carousel-item.blur .card {
    filter: blur(4px);
  }
  
  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    border: none;
    cursor: pointer;
    z-index: 1000;
  }
  
  .arrow-left {
    left: 10px;
  }
  
  .arrow-right {
    right: 10px;
  }
  </style>
  