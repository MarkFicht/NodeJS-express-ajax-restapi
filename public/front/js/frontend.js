$(() => {

    const addTask = $('.new-todo');
    const mainSection = $('.main');         // if tasks 0, display: none;
    const tasksFooter = $('.footer');       // if tasks 0, display: none;
    const ul = $('.todo-list');             // show/hide tasks & full list
    const count = $('.todo-count strong');  // counter of uncompleted tasks
    const clearCompleted = $('button.clear-completed');
    // let toggleAll = null;               // toggleAll will working, if 'il' in 'ul' > 0

    //--- Functions
    const countTasks = (allLi) => {         // + showHideMainSection()
        let len = allLi.length;
        count.html(len);
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
                        <input class="edit" value="${ text }">
                    </li>`);

        ul.append(li);
        addTask.val('');
        countTasks( ul.find('li') );

    });

    //--- Advanced Events
    /** Completed / Uncompleted task */
    ul.on('click', 'li input.toggle', function() {

        const self = $(this);
        const toggleCompleted = self.parent().parent().toggleClass('completed');

        if ( self.prop( "checked" ) ) {     // Warunkiem bedzie bool z JSON
            self.prop('checked', true);
            toggleCompleted;                // Zmieniamy wartosc bool na odwrotna z JSON
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

        if ( $(this).val() === '' ) {
            return alert('Edytowane zadanie nie moze byc puste!');
        }

        thisLi.find('label').text( $(this).val() );
        thisLi.removeClass('editing');

    });

    /** Remove task */
    ul.on('click', 'li button', function() {

        $(this).parent().parent().remove();
        countTasks( ul.find('li') );

    });

    /** Remove all completed */
    clearCompleted.on('click', function () {

        // const list = ul.find('li');
        // w jQ nie ma .forEach() dla tej pseudotablicy ... tylko .each()

        /** Very simple kod without REST API - ul.find('li.completed').remove() */
        ul.find('li.completed').remove();
        countTasks( ul.find('li') );

    });

});