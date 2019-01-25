$(() => {

    const addTask = $('.new-todo');
    const mainSection = $('.main');         // if tasks 0, display: none;
    const tasksFooter = $('.footer');       // if tasks 0, display: none;
    const ul = $('.todo-list');             // show/hide tasks & full list
    const count = $('.todo-count strong');  // counter of uncompleted tasks
    const clearCompleted = $('button.clear-completed');
    // let toggleAll = null;               // toggleAll will working, if 'il' in 'ul' > 0

    //--- Functions
    const renderList = () => {

        $.ajax({
            url: '/list',
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'GET',
            dataType: 'json'
        }).done( ans => {

            console.log('Odpowiedz z backendu: ' + ans);
            renderLiFromJson(ans);          // Render new list with li and counter

        }).fail( err => {
            console.log(`Nie udalo sie odczytac db.json z backendu ${err}`);
            console.log(err);
        });

    };

    const renderLiFromJson = (jsonFromAjax) => {     // countTasks() inside

        ul.find('li').remove();

        if (JSON.parse(jsonFromAjax).length === 0) {
            return countTasks(ul.find('li'));
        }

        JSON.parse(jsonFromAjax).forEach( ({ name, complete }, index) => {

            let li;
            if ( complete ) {
                li = $(`<li class="completed" data-id="${ index }">
                                <div class="view">
                                    <input class="toggle" type="checkbox" checked>
                                    <label>${ name }</label>
                                    <button class="destroy"></button>
                                </div>
                                <input class="edit" value="${ name }">
                            </li>`);
            } else {
                li = $(`<li data-id="${ index }">
                                <div class="view">
                                    <input class="toggle" type="checkbox">
                                    <label>${ name }</label>
                                    <button class="destroy"></button>
                                </div>
                                <input class="edit" value="${ name }">
                            </li>`);
            }

            ul.append(li);
            countTasks(ul.find('li'));
        });
    };

    const countTasks = (allLi) => {         // showHideMainSection() inside
        let len = allLi.length;
        count.text(len);
        showHideMainSection(len);
    };

    const showHideMainSection = (allLiLen) => {
        if (allLiLen === 0) {
            mainSection.hide();
            tasksFooter.hide();
        } else {
            mainSection.show();
            tasksFooter.show();
        }
    };

    //--- Start App
    renderList();                           // countTasks() & showHideMainSection() inside

    //--- Events
    /** Add new task */
    addTask.on('change', function() {       // ES5 function() {} for working $(this)

        let text = addTask.val();
        let addNewTask = {
            name: text,
            complete: false
        };

        $.ajax({
            url: '/add',
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(addNewTask),
        }).then( ans => {

            console.log('Odpowiedz z backendu - POST: ' + ans);
            renderLiFromJson(ans);
            addTask.val('');

        });

    });

    //--- Advanced Events
    /** Completed / Uncompleted task */
    ul.on('click', 'li input.toggle', function() {

        const id = $(this).parent().parent().data('id');

        $.ajax({
            url: `/list/completed/${id}`,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'PUT'
        }).then( ans => {

            /** Wersja z renderowaniem nowej listy */
            console.log('Odpowiedz z backendu - PUT: ' + ans);
            // renderLiFromJson(ans);

        });

        /** Wersja bez renderowania listy na nowo */
        const self = $(this);
        const toggleCompleted = self.parent().parent().toggleClass('completed');

        if ( self.prop( "checked" ) ) {
            self.prop('checked', true);
            toggleCompleted;
        } else {
            self.prop('checked', false);
            toggleCompleted;
        }

    });

    /** Start edit task */
    ul.on('dblclick', 'li label', function() {

        $(this).parent().parent().addClass('editing');

    });

    /** End edit task */
    ul.on('change', 'li input.edit', function() {

        const thisLi = $(this).parent();
        const id = thisLi.data('id');
        const text = $(this).val();

        if ( text === '' ) {
            return alert('Edytowane zadanie nie moze byc puste!');
        }

        $.ajax({
            url: `/list/edit/${id}`,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'PUT',
            data: JSON.stringify({
                text
            })
        }).then( ans => {

            console.log('Odpowiedz z backendu - PUT: ' + ans);
            renderLiFromJson(ans);

        });

    });

    /** Remove task */
    ul.on('click', 'li button', function() {

        const id = $(this).parent().parent().data('id');

        $.ajax({
            url: `/delete/${id}`,
            headers: {
                'Content-Type': 'application/json'
            },
            type: 'DELETE',
            dataType: 'json'
        }).then( ans => {

            console.log('Odpowiedz z backendu - DELETE: ' + ans);
            renderLiFromJson(ans);

        });

    });

    /** Remove all completed */
    clearCompleted.on('click', function () {

        $.ajax({
            url: '/delete/completed',
            type: 'PUT',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( ans => {

            console.log('Odpowiedz z backendu - PUT: ' + ans);
            renderLiFromJson(ans);

        });

    });

});