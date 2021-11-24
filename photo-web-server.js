class Gallery {
    constructor() {
        this.API_KEY = '563492ad6f91700001000001830871c637f74ef1b9df2e7634d1b9fb';
        this.galleryContainer = document.querySelector('.gallery');
        this.searchForm = document.querySelector('.header form');
        this.loadMore = document.querySelector('.load-more');
        this.loadPrevious = document.querySelector('.load-previous');
        this.logo = document.querySelector('.logo')
        this.pageIndex = 1;
        this.inputSearchPhoto = '';
        this.loadGallery();
    }
    loadGallery() {
        document.addEventListener('DOMContentLoaded', () => {
            this.getCuratedPhotos(1);
        });
        this.searchForm.addEventListener('submit', (e) => {
            this.pageIndex = 1;
            this.getSearchedImages(e);
        });
        this.loadMore.addEventListener('click', (e) => {
            this.loadMoreImages(e);
        })
        this.loadPrevious.addEventListener('click', (e) => {
            this.loadMoreImages(e);
        })
        this.logo.addEventListener('click', () => {
            this.pageIndex = 1;
            this.galleryContainer.innerHTML = '';
            this.getCuratedPhotos(this.pageIndex);
        })
    }
    async getCuratedPhotos(index) {
        this.loadPrevious.setAttribute('img-type', 'curated');
        this.loadMore.setAttribute('img-type', 'curated');
        const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=10`;
        const data = await this.fetchImages(baseURL);
        this.CreateHTML(data.photos)
        console.log(data)
    }
    async fetchImages(baseURL) {
        const response = await fetch(baseURL, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: this.API_KEY
            }
        });
        const data = await response.json();
        return data;
    }
    CreateHTML(photos) {
        if(this.pageIndex > 1) {
            this.loadPrevious.style.display = 'inline-block';
        } else {
            this.loadPrevious.style.display = 'none';
        }
        photos.forEach(photo => {
            const item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
        <a href='${photo.src.original}' target="_blank">
          <img src="${photo.src.medium}">
          <h3>${photo.photographer}<br />${photo.photographer_url}</h3>
        </a>
        `;
            this.galleryContainer.appendChild(item)
        })
    }
    async getSearchedImages(e) {
        this.loadPrevious.setAttribute('img-type', 'search');
        this.loadMore.setAttribute('img-type', 'search');
        e.preventDefault();
        this.galleryContainer.innerHTML = '';
        const searchValue = e.target.querySelector('input').value;
        this.inputSearchPhoto = searchValue;
        const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=10`
        const data = await this.fetchImages(baseURL);
        this.CreateHTML(data.photos);
        e.target.reset();
    }
    async getMoreSearchedImages(index) {
        // console.log(searchValue)
        const baseURL = `https://api.pexels.com/v1/search?query=${this.inputSearchPhoto}&page=${index}&per_page=10`
        const data = await this.fetchImages(baseURL);
        console.log(data)
        this.CreateHTML(data.photos);
    }
    loadMoreImages(e) {
        this.galleryContainer.innerHTML = '';
        debugger
        let index = e.target.className === 'load-previous' ? --this.pageIndex: ++this.pageIndex;
        const loadMoreData = e.target.getAttribute('img-type');
        if (loadMoreData === 'curated') {
            // load next page for curated]
            this.getCuratedPhotos(index)
        } else {
            // load next page for search
            this.getMoreSearchedImages(index);
        }
    }
}

const gallery = new Gallery;