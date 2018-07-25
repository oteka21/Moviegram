// function cambiarNombre(nuevoNombre) {
//   cambia = nuevoNombre
// }

// const getUser = new Promise((resolve, reject)=>{
// setTimeout(()=>{
// 	resolve('Ya paso un segundo')
// },1000)
// //resolve()
// });

// const getUserAll = new Promise((resolve, reject)=>{
// setTimeout(()=>{
// 	resolve('Ya pasaron 3 segundos')
// },3000)
// //resolve()
// });

// // getUser
// // 	.then((data)=>{
// // 		console.log(data);
// // 	})
// // 	.catch((err)=>{
// // 		console.log(`error al cargar los datos: ${err}`)
// // 	});

// 	Promise.all([
// 	getUser,
// 	getUserAll,
// 		])
// 	.then((message)=>{
// 		console.log(message)
// 	})
// 	.catch((err)=>{
// 		console.log(`error al cargar los datos: ${err}`)
// 	});


// // $.ajax('https://randomuser.me/api/',{
// // 	method: 'GET',
// // 	success:(data)=>{
// // 		console.log(data)
// // 	}
// // })

// fetch('https://randomuser.me/api/')
// 	.then((data)=>{
// 		// console.log(JSON.parse(data));
// 		return data.json();
// 	})
// 	.then((user)=>{
// 		console.log(user.results[0].name.first);
// 	})
// 	.catch((err)=>{
// 		console.log('algo salio mal');
// 	})

(async function load(){
	const URL = 'https://yts.am/api/v2/';
	//accion
	//terror
	//animacion
	async function getData(Url){
	const response = await fetch(Url)
	const data =  await response.json();
	return data;
	}

	const $form = document.getElementById('form');
	const $home = document.getElementById('home');
	const $modal = document.getElementById('modal');
	const $overlay = document.getElementById('overlay');
	const $hideModal = document.getElementById('hide-modal');
	const $featuringContainer = document.getElementById('featuring');
	const $modalImg = $modal.querySelector('.modal-content img');
	const $modalTitle = $modal.querySelector('h1');
	const $modalDescription = $modal.querySelector('.modal-content p');

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
		const peli =  await getData(`${URL}list_movies.json?limit=1&query_term=${data.get('name')}`)
		const HTMLString = featuringTemplate(peli.data.movies[0]);
		$featuringContainer.innerHTML = HTMLString;
	});

	const actionList = await getData(`${URL}list_movies.json?genre=action`);
	const horrorList = await getData(`${URL}list_movies.json?genre=horror`);
	const animationList = await getData(`${URL}list_movies.json?genre=animation`);
	// console.log(horrorList);

	const $actionContainer = document.querySelector('#action');
	const $horrorContainer = document.getElementById('horror');
	const $animationContainer = document.getElementById('animation');

	//declarar funciones para que se muestre el modal
	function showModal(){
		$overlay.classList.toggle('active');
		$modal.style.animation = 'modalIn .8s forwards';
	}

	function hideModal(){
		setTimeout(()=>{
		$overlay.classList.toggle('active');
		},1000);
		$modal.style.animation = 'modalOut .8s forwards';
	}

	$hideModal.addEventListener('click', hideModal);

	//-----------------------------------------------
	function videoItemTemplate(movie){
		return(
			`<div class="primaryPlaylistItem">
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

	function addEventClick($element,movie){
		$element.addEventListener('click',()=>{
			// $overlay.classList.toggle('active');
			showModal();
		});
	}
	function renderMovieList(listMovie,$container){
		$container.querySelectorAll('img')[0].remove();
			listMovie.data.movies.forEach((movie) =>{
				const HTMLString = videoItemTemplate(movie);
				const movieElement = createHTML(HTMLString); 
				$container.append(movieElement);
				addEventClick(movieElement,movie);
		});
	}
	renderMovieList(actionList,$actionContainer);
	renderMovieList(horrorList,$horrorContainer);
	renderMovieList(animationList,$animationContainer);


	// console.log(videoItemTemplate('asdf','mi imagen'));
})()



