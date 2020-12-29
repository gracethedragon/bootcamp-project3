import axios from 'axios';
import './styles.scss';

// Make a request for all the items
axios.get('/items')
  .then(function (response) {
    // handle success
    console.log(response.data.items);

    const itemCont = document.createElement('div');

    const itemEls = response.data.items.forEach( item =>{
      const itemEl = document.createElement('div');
      itemEl.innerText = JSON.stringify(item)
      itemEl.classList.add('item');
      document.body.appendChild( itemEl );
    });

    document.body.appendChild( itemCont );
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
