// (async function loadList(){

// })()
(async function loadMovies(){
	const URL = 'https://yts.am/api/v2/';
	//accion
	//terror
	//animacion
	function getPelis(data){
	if (data.data.movie_count > 0){
		return data;
	}else{
		throw new Error('no se encontro ninguna pelicula')
	}
	}
	async function getData(Url,type){
	const response = await fetch(Url)
	const data =  await response.json();
	if (type == 'pelis'){
		return getPelis(data);
	}else{
		return data;
	}
	}

	const $form = document.getElementById('form');
	const $home = document.getElementById('home');
	const $modal = document.getElementById('modal');
	const $overlay = document.getElementById('overlay');
	const $hideModal = document.getElementById('hide-modal');
	const $featuringContainer = document.getElementById('featuring');
	let $modalImg = $modal.querySelector('.modal-content img');
	let $modalTitle = $modal.querySelector('h1');
	let $modalDescription = $modal.querySelector('.modal-content p');

	function setAttributes($element,settings){
		for (const attribute in settings){
			$element.setAttribute(attribute, settings[attribute]);	
		}
	}

	function featuringTemplate(pelicula){
		return (
			`<div class="featuring">
        <div class="featuring-image">
          <img src="${pelicula.medium_cover_image}" width="70" height="100" alt="">
        </div>
        <div class="featuring-content">
          <p class="featuring-title">Pelicula encontrada</p>
          <p class="featuring-album">${pelicula.title}</p>
        </div>
      </div>`
		);
	}
	$form.addEventListener('submit', async (e)=>{
		e.preventDefault();
		$home.classList.add('search-active');
		const $loader = document.createElement('img');
		const settings = {
			src: 'src/images/loader.gif',
			width: 50,
			height: 50
		}
		setAttributes($loader,settings);
		$featuringContainer.append($loader);

		const data =  new FormData($form);
		try{
			const {
				data:{
					movies:peli
				}
			} =  await getData(`${URL}list_movies.json?limit=1&query_term=${data.get('name')}`,'pelis')
			const HTMLString = featuringTemplate(peli[0]);
			$featuringContainer.innerHTML = HTMLString;

		}catch(err){
			// console.log('pelicula no Encontrada');
			alert(err.message);
			$loader.remove();
			$home.classList.remove('search-active')
		}
	});

	// console.log(horrorList);


	//declarar funciones para que se muestre el modal
	function findMovie(id,category){
		switch (category) {
			case 'action':
				// statements_1
				 return actionList.find(movie =>  movie.id === parseInt(id,10));
				break;
			case 'horror':
				 return horrorList.find(movie =>  movie.id === parseInt(id,10));
				break;
			case 'animation':
				return animationList.find(movie =>  movie.id === parseInt(id,10));
				break;
		}
	}

	function showModal($element){
		$overlay.classList.toggle('active');
		$modal.style.animation = 'modalIn .8s forwards';
		const id = parseInt($element.dataset.id);
		const category = $element.dataset.category;
		const data = findMovie(id,category);
		$modalImg.setAttribute('src', data.medium_cover_image);
		$modalTitle.textContent = data.title;
		$modalDescription.textContent = data.description_full;
		
	}

	function hideModal(){
		setTimeout(()=>{
		$overlay.classList.toggle('active');
		},1000);
		$modal.style.animation = 'modalOut .8s forwards';
	}

	$hideModal.addEventListener('click', hideModal);

	//-----------------------------------------------
	function videoItemTemplate(movie,category){
		return(
			`<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
                <div class="primaryPlaylistItem-image">
                  <img src="${movie.medium_cover_image}">
                </div>
                <h4 class="primaryPlaylistItem-title">
                  ${movie.title}
                </h4>`
               )
			}

	function createHTML(HTMLString){
		const html = document.implementation.createHTMLDocument();
		html.body.innerHTML = HTMLString;
		return html.body.children[0];
	}

	function addEventClick($element){
		$element.addEventListener('click',()=>{
			// $overlay.classList.toggle('active');
			showModal($element);
		});
	}

	function renderMovieList(listMovie,$container,category){
		$container.querySelectorAll('img')[0].remove();
			listMovie.forEach((movie) =>{
				const HTMLString = videoItemTemplate(movie,category);
				const movieElement = createHTML(HTMLString); 
				$container.append(movieElement);
				const image = movieElement.querySelector('img');
				image.addEventListener('load', (e)=>{
					e.srcElement.classList.add('fadeIn')
				});
				// movieElement.classList.add('fadeIn');
				addEventClick(movieElement);
		});
	}
	//load playList
	let $friendsPlayListContainer = document.querySelector('.sidebarPlaylist ul');
	function templateFriendPlayList(friend){
		return (
			`<li class="playlistFriends-item fadeIn">
              <a href="#">
                <img src="${friend.results[0].picture.medium}" alt="${friend.results[0].name.first} ${friend.results[0].name.last}" />
                <span>
                  ${friend.results[0].name.first} ${friend.results[0].name.last}
                </span>
              </a>
            </li>`
			);
	}

	function renderFriendsPlaylist(playList){
		playList.forEach( (element) => {
			const HTMLPlayList = templateFriendPlayList(element);
			$friendsPlayListContainer.innerHTML += HTMLPlayList;
		});
	}

	const friendsPlayList =[];
	for (let i = 0; i < 20; i++){
		friendsPlayList.push(await getData('https://randomuser.me/api/','playlist'));
	}
	renderFriendsPlaylist(friendsPlayList);

	const {data: {movies: actionList}} = await getData(`${URL}list_movies.json?genre=action`,'pelis');
	const $actionContainer = document.querySelector('#action');
	renderMovieList(actionList,$actionContainer,'action');

	const {data: {movies: horrorList}} = await getData(`${URL}list_movies.json?genre=horror`,'pelis');
	const $horrorContainer = document.getElementById('horror');
	renderMovieList(horrorList,$horrorContainer,'horror');
	
	const {data: {movies: animationList}} = await getData(`${URL}list_movies.json?genre=animation`,'pelis');
	const $animationContainer = document.getElementById('animation');
	renderMovieList(animationList,$animationContainer,'animation');

})();

