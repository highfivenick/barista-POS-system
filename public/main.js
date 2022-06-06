let ready = document.getElementsByClassName("fas fa-mug-hot");
let trash = document.getElementsByClassName("fa-trash");

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const order = this.parentNode.parentNode.childNodes[5].innerText       
        console.log(order,  name );
        fetch('orders', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'order': order,
            
          })
        }).then(function (response) {
          window.location.reload() //take the response and reload the page
        })
      });
});


Array.from(ready).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const order = this.parentNode.parentNode.childNodes[5].innerText //not finding it 
        const status = this.parentNode.parentNode.childNodes[7].innerText
        const barista = this.parentNode.parentNode.childNodes[9].innerText
        console.log(order, name );
        fetch('orders', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'order': order,
            'status':status,
            'barista': barista
          })
        })

        .then(response => {
          if (response.ok){
            let orderUp = new SpeechSynthesisUtterance()
            orderUp.text = 'order For ' + name + "is ready"
            window.speechSynthesis.speak(orderUp)
            return response.json()
          }
        })

        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });

});