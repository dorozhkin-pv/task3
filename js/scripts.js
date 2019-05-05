window.addEventListener('load', function(){

    let btn = document.querySelector('.go');
    let table = document.querySelector('.table');
    let cell = document.querySelectorAll('.table td');
    let timerBox = document.querySelector('.timer');
    timerBox.innerHTML = '00.00.00';
    let colors = ['#fe0000', '#fc00f1', '#002efe', '#ffb901', '#21dc13', '#00fbe4', '#d8db12', '#7a7a7a'];
    let interval;   //for setInterval
    


    function rndCell() {    //на выходе получается массив рандомно расположенных ячеек
        let rndArr1 = [];    //array

        loop:
        for (let i = 0; i < cell.length / 2; i++) {

            let rnd = Math.floor(Math.random() * cell.length);
            rndArr1.push(rnd);

            if (rndArr1.length > 1) {
                for (let j = 0; j < rndArr1.length; j++) {
                    if (rndArr1[j-1] == rnd) {
                        rndArr1.pop();
                        --i;
                        continue loop;
                    }
                }
            }
        }
        
        let rndArr2 = [];

        for (let i = 0; i < cell.length; i++) rndArr2.push(i);
         
        for (let i = 0; i < rndArr2.length; i++) {
            for (let j = 0; j < rndArr1.length; j++) {
                if (rndArr2[i] == rndArr1[j]) {

                    rndArr2.splice(i, 1);
                    --i;
                }
            }
        }

        return rndArr1.concat(rndArr2);;
    }

    function tableInitByColors() {  //инициализирую ячейки цветами

        let randomCell = rndCell();
        let count = 0;

        randomCell.forEach(function(item) {
            cell[item].dataset.color = colors[count];
            cell[item].dataset.myNumber = item;
            count++;

            if (count == colors.length) count = 0;
        });
        
    }

    function timer() {  //таймер
        let time = 0;
        btn.disabled = true;

        interval = setInterval(function() {
            time++;

            let ms = time % 100;
            let sec = parseInt((time / 100) % 60);
            let min = parseInt((time / 6000) % 60);

            if (ms.toString().length == 1) ms = '0' + ms;
            if (sec.toString().length == 1) sec = '0' + sec;
            if (min.toString().length == 1) min = '0' + min;

            timerBox.innerHTML = `${min}:${sec}:${ms}`;
            
        }, 10);
    }

    function timerStop() {  //когда игра окончена
        clearInterval(interval);
        btn.disabled = false;
    }

    btn.addEventListener('click', function() {  //запускает таймер и инициализирует ячейки таблицы
        timer();
        tableInitByColors();
    });

    let firstClick;
    let secondClick;
    let flag = false;
    let timerId;
    table.addEventListener('click', function(e) {   //обрабатываю нажатия на ячейки
        let td = e.target;
        if (td.tagName != 'TD') return;

        if (td.dataset.opened) return;

        clearTimeout(timerId);

        if (!flag) {
            td.style.backgroundColor = td.dataset.color;
            firstClick = td;
            console.log(firstClick);

            flag = true;
        }else{
            td.style.backgroundColor = td.dataset.color;
            secondClick = td;
            console.log(secondClick);

            flag = false;

            if (firstClick.dataset.color == secondClick.dataset.color) {

                if (firstClick.dataset.myNumber == secondClick.dataset.myNumber) {
                    flag = true;
                    return;
                }

                firstClick.dataset.opened = true;
                secondClick.dataset.opened = true;
                flag = false;
            }else{
                
                timerId = setTimeout(function() {
                    firstClick.style.backgroundColor = 'inherit';
                    secondClick.style.backgroundColor = 'inherit';
                }, 250);
            }
        }

        function checkWin() {   //проверка все ли ячейки открыты

            let cellFin = [];
            for (let i = 0; i < cell.length; i++) {
                cellFin.push(cell[i]);
            }

            return cellFin.every(function(td) {
                            return td.hasAttribute('data-opened');
                        });
        }

        if (checkWin()) {   //если открыты, останавливаем таймер, очищаем поле
            timerStop();
            alert("Вы выиграли!\nЗатраченное время: " + timerBox.innerHTML);

            for (let i = 0; i < cell.length; i++) {
                cell[i].removeAttribute('data-color');
                cell[i].removeAttribute('data-my-number');
                cell[i].removeAttribute('data-opened');
                cell[i].removeAttribute('style');
            }

        }
        

        
    });



});

