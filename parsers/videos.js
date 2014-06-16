var jquery = fs.readFileSync("../utils/jquery.js", "utf-8");
/**
 * Retorna listados listadas em uma pagina de categoria
 * @param  {Object}   jsdom    Instancia do JSDOM
 * @param  {Number}   page     Numero da pagina
 * @param  {Function} callback Callback para os resultados
 * @return {void}
 */
exports.get = function (jsdom, url, callback) {
	jsdom.env({

		url: url,

		scripts: [jquery],

		done: function (errors, window) {
			var $ = window.$,
				videos = [],
				$mainBox = $('.mainBox').eq(1),
				$list = $mainBox.find('.mainList');

			$list.each(function () {
				var $this = $(this),
					$title = $this.find('.videoTitle a');

				console.log('    |___ ' + $title.text());

				videos.push({
					id: $title.attr('href').split('/')[4],
					title: $title.text(),
					url: $title.attr('href'),
					thumb: $this.find('.videoThumb img').attr('src')
				});
			});

			window.close();
			callback(videos);
		}
	});
};