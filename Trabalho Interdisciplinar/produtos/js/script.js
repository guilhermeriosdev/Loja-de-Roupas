
// criar a variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de peçass na modal
let quantpeçass = 1

let cart = [] // carrinho
// / 05

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.peçasWindowArea').style.opacity = 0 // transparente
    seleciona('.peçasWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.peçasWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.peçasWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.peçasWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.peçasInfo--cancelButton, .peçasInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDaspeçass = (peçasItem, item, index) => {
    
    // setar um atributo para identificar qual elemento foi clicado
	peçasItem.setAttribute('data-key', index)
    peçasItem.querySelector('.peças-item--img img').src = item.img
    peçasItem.querySelector('.peças-item--price').innerHTML = formatoReal(item.price[2])
    peçasItem.querySelector('.peças-item--name').innerHTML = item.name
    peçasItem.querySelector('.peças-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.peçasBig img').src = item.img
    seleciona('.peçasInfo h1').innerHTML = item.name
    seleciona('.peçasInfo--desc').innerHTML = item.description
    seleciona('.peçasInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}


const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .peças-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.peças-item').getAttribute('data-key')
    console.log('peças clicada ' + key)
    console.log(peçasJson[key])

    // garantir que a quantidade inicial de peçass é 1
    quantpeçass = 1

    // Para manter a informação de qual peças foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.peçasInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.peçasInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = peçasJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.peçasInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.peçasInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target usar size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.peçasInfo--actualPrice').innerHTML = formatoReal(peçasJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.peçasInfo--qtmais').addEventListener('click', () => {
        quantpeçass++
        seleciona('.peçasInfo--qt').innerHTML = quantpeçass
    })

    seleciona('.peçasInfo--qtmenos').addEventListener('click', () => {
        if(quantpeçass > 1) {
            quantpeçass--
            seleciona('.peçasInfo--qt').innerHTML = quantpeçass	
        }
    })
}



const adicionarNoCarrinho = () => {
    seleciona('.peçasInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual peças? pegue o modalKey para usar peçasJson[modalKey]
    	console.log("peças " + modalKey)
    	// tamanho
	    let size = seleciona('.peçasInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantpeçass)
        // preco
        let price = seleciona('.peçasInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
	    let identificador = peçasJson[modalKey].id+'t'+size
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantpeçass
        } else {
            // adicionar objeto peças no carrinho
            let peças = {
                identificador,
                id: peçasJson[modalKey].id,
                size, // size: size
                qt: quantpeçass,
                price: parseFloat(price) // price: price
            }
            cart.push(peças)
            console.log(peças)
            console.log('Sub total R$ ' + (peças.qt * peças.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('.produtospagina').style.display = 'flex'
    }

   
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('.produtospagina').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let peçasItem = peçasJson.find( (item) => item.id == cart[i].id )
			console.log(peçasItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let peçasSizeName = cart[i].size

			let peçasName = `${peçasItem.name} (${peçasSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = peçasItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = peçasName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        alert("Compra Efetuada com Sucesso");
        window. location. href = "https://pbs.twimg.com/media/FiL7WQGWAAALBng.png";
        console.log('Finalizar compra');
        seleciona('aside').classList.remove('show');
        seleciona('aside').style.left = '100vw';
        seleciona('header').style.display = 'flex';
        
        
    })
}



// MAPEAR peçasJson para gerar lista de peçass
peçasJson.map((item, index ) => {
    //console.log(item)
    let peçasItem = document.querySelector('.models .peças-item').cloneNode(true)
    //console.log(peçasItem)
    //document.querySelector('.peças-area').append(peçasItem)
    seleciona('.peças-area').append(peçasItem)

    // preencher os dados de cada peças
    preencheDadosDaspeçass(peçasItem, item, index)
    
    // peças clicada
    peçasItem.querySelector('.peças-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na peças')

        
        let chave = pegarKey(e)
        

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.peçasInfo--qt').innerHTML = quantpeçass

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
      

    })

    botoesFechar()

}) // fim do MAPEAR peçasJson para gerar lista de peçass


// mudar quantidade com os botoes + e -
mudarQuantidade()



adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()

