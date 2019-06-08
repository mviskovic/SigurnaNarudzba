App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },

    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
   
    loadAccount: async () => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0];
    },

    loadContract: async () => {
        // Create a JavaScript version of the smart contract
        const novaNarudzba = await $.getJSON('SigurnaNarudzba.json')
        App.contracts.Narudzba = TruffleContract(novaNarudzba)
        App.contracts.Narudzba.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.novaNarudzba = await App.contracts.Narudzba.deployed()
    },

    render: async () => {
        // Prevent double render
        if(App.loading) {
            return
        }
        // Update app loading state
        App.setLoading(true)

        // Render Account
        $('#account').html(App.account)

        // Render Tasks
        await App.renderNarudzba()

        // Update loading state
        App.setLoading(false)
    },

    renderNarudzba: async () => {
        const brojacNarudzbi = await App.novaNarudzba.brojacNarudzbi()
        const $buttonContainer = $('.buttonContainer')

        for(var i = 1; i <= brojacNarudzbi; i++) {
            const narudzba = await App.novaNarudzba.narudzbe(i)
            const narudzbaId = narudzba[0].toNumber()
            const narudzbaOpisNarudzbe = narudzba[1]
            const narudzbaStanjeNarudzbe = narudzba[2]

            const $newButtonContainer = $buttonContainer.clone()
            $newButtonContainer.find('.content').html(narudzbaOpisNarudzbe)

            $newButtonContainer.find('input')
                            .prop('name', narudzbaId)
                            .prop('value', narudzbaStanjeNarudzbe)
                            .on('click', App.kolonaNarudzbe)

            if(narudzbaStanjeNarudzbe == 0){
              $newButtonContainer.find('input').prop('value', "Place order").css("background-color", "#0a7f21")
              $('#postaviNarudzbu').append($newButtonContainer)
            }else if (narudzbaStanjeNarudzbe == 1) {
              $newButtonContainer.find('input').prop('value', "In progress").css("background-color", "#f4cd41")
                $('#zaprimiNarudzbu').append($newButtonContainer)
            } else if(narudzbaStanjeNarudzbe == 2){
              $newButtonContainer.find('input').prop('value', "Finished").attr( "disabled", "disabled").css({"background-color": "#87857d", "color": "white"})
                $('#narudzbuZavrsena').append($newButtonContainer)
            }
            $newButtonContainer.show()
        } 
    },

    kreirajNarudzbu: async () => {
        App.setLoading(true)
        const brojStola = $('#brojStola').val()
        const opisNarudzbe = $('#sadrzajNarudzbe').val()
        const nardudzba ="<br/>" + "Stol: " + brojStola +  "<br/>" + "Narudzba: " + opisNarudzbe
        await App.novaNarudzba.kreirajNarudzbu(nardudzba)
        window.location.reload()
    },

    kolonaNarudzbe: async (e) => {
        App.setLoading(true)
        const narudzbaId = e.target.name
        await App.novaNarudzba.kolonaNarudzbe(narudzbaId)
        window.location.reload()
    },
        
        
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const opisNarudzbe = $('#content')
        if(boolean) {
            loader.show()
            opisNarudzbe.hide()
        } else {
            loader.hide()
            opisNarudzbe.show()
        }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })