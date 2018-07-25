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
	const URL = 'https://yts.am/api/v2/list_movies.json?genre=';
	//accion
	//terror
	//animacion
	async function getData(Url){
	const response = await fetch(Url)
	const data =  await response.json();
	return data;
	}


	const actionList = await getData(`${URL}action`);
	const horrorList = await getData(`${URL}horror`);
	const animationList = await getData(`${URL}animation`);
	 console.log(horrorList);

	const $actionContainer = document.querySelector('#action');
	const $horrorContainer = document.getElementById('horror');
	const $animationContainer = document.getElementById('animation');

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

	function createHTML(movie){
		const HTMLString = videoItemTemplate(movie);
		const html = document.implementation.createHTMLDocument();
		html.body.innerHTML = HTMLString;
		return html.body.children[0];
	}
	function renderMovieList(listMovie,$container){
		$container.querySelectorAll('img')[0].remove();
			listMovie.data.movies.forEach((movie) =>{
			$container.append(createHTML(movie));
		});
	}
	renderMovieList(actionList,$actionContainer);
	renderMovieList(horrorList,$horrorContainer);
	renderMovieList(animationList,$animationContainer);

	const $featuringContainer = document.getElementById('featuring');
	const $form = document.getElementById('form');
	const $home = document.getElementById('home');

	const $modal = document.getElementById('modal');
	const $overlay = document.getElementById('overlay');
	const $hideModal = document.getElementById('hide-Modal');

	const $modalImg = $modal.querySelector('img');
	const $modalTitle = $modal.querySelector('h1');
	const $modalDescription = $modal.querySelector('p')

	// console.log(videoItemTemplate('asdf','mi imagen'));
})()



