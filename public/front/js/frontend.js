$(() => {

    const addTask = $('.new-todo');
    const mainSection = $('.main');         // if tasks 0, display: none;
    const tasksFooter = $('.footer');       // if tasks 0, display: none;
    const toggleAll = $('#toggle-all');     // show/hide tasks
    const ul = $('.todo-list');             // show/hide tasks
    const count = $('.todo-count strong');  // counter of uncompleted tasks

    //--- Functions
    const countTasks = (allLi) => {         // + showHideMainSection()
        let len = allLi.length;
        count.html(len);
        showHideMainSection(len);
    };

    const showHideMainSection = (allLiLen) => {
        if (allLiLen === 0) {
            toggleAll.hide();
            tasksFooter.hide();
        } else {
            toggleAll.show();
            tasksFooter.show();
        }
    };

    //--- Start App
    countTasks(ul.find('li'));

    //--- Events
    addTask.on('change', function() {       // ES5 function() {} for working $(this)

        let text = addTask.val();
        let li = $(`<li>
                        <div class="view">
                            <input class="toggle" type="checkbox">
                            <label>${ text }</label>
                            <button class="destroy"></button>
                        </div>
                        <input class="edit" value=${ text }>
                    </li>`);

        ul.append(li);
        addTask.val('');
        countTasks( ul.find('li') );

    });

    //--- Advanced Events
    ul.on('click', 'li input.toggle', function() {
        console.log('klikam input.toogle w li');
    });

    ul.on('click', 'li label', function() {
        console.log('klikam label w li', $(this), this);
    });

    ul.on('change', 'li input.edit', function() {
        console.log('Zmiany w trybie edytowania li');
    });

    ul.on('click', 'li button', function() {
        console.log('klikam btn w li');
    });

});