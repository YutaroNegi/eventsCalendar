let nav = 0;
let clicked = null;
let events = []

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal')
const deleteEventModal = document.getElementById('deleteEventModal')
const eventTimeStartInput = document.getElementById('eventTimeStartInput')
const eventTimeEndInput = document.getElementById('eventTimeEndInput')
const eventTimeInput = document.getElementById('eventTimeInput')
const backDrop = document.getElementById('modalBackDrop')
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

getEventsFromServer()
load()
initButtons()

document.getElementById('logout').addEventListener('click',()=>{
    localStorage.removeItem('myId')
    window.location.href = "http://localhost:5000"
})

function getEventsFromServer() {
    const user = {
        myId: localStorage.getItem('myId')
    }

    const options = {
        method: "POST",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(user) 
    }

    fetch('http://localhost:5000/calendar/events', options).then(res => {
        return res.json()
    }).then(json => {
        if (json) {
            events = json
            load()
        }else{
            events = []
        }
    }).catch(error => {
        console.log(error);
    })

}

function load() {
    initModalButtons()
    listAllEvents() //BACKEND
    const dt = new Date()

    if (nav !== 0) { //navigation from the months
        dt.setMonth(new Date().getMonth() + nav)
    }
    const day = dt.getDate()
    const month = dt.getMonth()
    const year = dt.getFullYear()

    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()  //how many days in month

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', { //show fist day of the month, and a string whith a date
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });


    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]) //how many empty days from the other month

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`

    calendar.innerHTML = ''

    for (let i = 1; i <= paddingDays + daysInMonth; i++) { //print all the days in the month
        const daySquare = document.createElement('div')
        daySquare.classList.add('day')
        const dayString = `${month + 1}/${i - paddingDays}/${year}`

        if (i > paddingDays) { 
            
            daySquare.innerText = i - paddingDays

            const eventForDay = events.find(e => e.date === dayString)

            if (i - paddingDays === day && nav === 0) { //show the current day
                daySquare.id = 'currentDay'
            }

            if (eventForDay) { //add event information inside the day div

                const eventDiv = document.createElement('div')
                eventDiv.classList.add('event')
                eventDiv.innerHTML = eventForDay.title + `<br>` + eventForDay.startTime + ' ~ ' + eventForDay.endTime
                daySquare.appendChild(eventDiv)
                daySquare.id = eventForDay._id
            }
            
            daySquare.addEventListener('click', () => { openModal(dayString) })
        } else { //set the empty days from other month
            daySquare.classList.add('padding')
        }
        calendar.appendChild(daySquare)
    }
}

function listAllEvents() {
    let eventsList = document.getElementById('allEventsContainer')
    eventsList.innerHTML = ''
    events.forEach(event => {
        let div = document.createElement('div')
        let title = document.createElement('h5')
        let date = document.createElement('p')
        let time = document.createElement('h6')
        let deleteButton = document.createElement('button')
        let editButton = document.createElement('button')
        editButton.id = 'editButtonList'

        title.classList.add('mb-3')
        div.classList.add('shadow', 'p-3', 'pe-5', 'ps-5', 'mb-5', 'rounded')
        deleteButton.classList.add('w-25', 'border', 'border-dark', 'shadow', 'rounded', 'fs-5', 'deleteButtonList', 'me-4',)
        editButton.classList.add('w-25', 'border', 'border-dark', 'shadow', 'rounded', 'fs-5', 'editButtonList')

        title.innerText = event.title
        time.innerText = `${event.startTime} ~ ${event.endTime}`
        date.innerText = event.date


        deleteButton.addEventListener('click', () => {
            deleteEventList(event.date)
        })

        editButton.addEventListener('click', () => {
            openModal(event.date)
        })

        deleteButton.innerText = 'delete'
        editButton.innerText = 'edit'


        div.appendChild(title)
        div.appendChild(time)
        div.appendChild(date)
        div.appendChild(deleteButton)
        div.appendChild(editButton)


        eventsList.appendChild(div)
    });
}

function openModal(date) {
    clicked = date;
    const eventForDay = events.find(e => e.date === clicked)

    if (eventForDay) {
        document.getElementById('eventText').innerText = eventForDay.title + '  ' + eventForDay.startTime + ' ~ ' + eventForDay.endTime
        deleteEventModal.style.display = 'block'
    } else {
        newEventModal.style.display = 'block'
    }

    backDrop.style.display = 'block'
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load()
    })
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load()
    })
}

function initModalButtons() {
    document.getElementById('saveButton').addEventListener('click', saveEvent)
    document.getElementById('cancelButton').addEventListener('click', closeModal)

    document.getElementById('deleteButton').addEventListener('click', deleteEvent)
    document.getElementById('editButton').addEventListener('click', editEvent)
    document.getElementById('closeButton').addEventListener('click', closeModal)
}

function closeModal() {
    getEventsFromServer()
    eventTitleInput.classList.remove('error')
    newEventModal.style.display = 'none'
    deleteEventModal.style.display = 'none'
    backDrop.style.display = 'none'
    eventTitleInput.value = ''
    eventTimeStartInput.value = ''
    eventTimeEndInput.value = ''
    deleteEventModal.innerHTML = `<div id="editableModal"></div>
    <div id="modalContent">
        <h2>Event</h2>
        <p class="fs-5 rounded p-2" id="eventText"> </p>
    </div>

    <div class="d-flex justify-content-around">
        <button class="w-25 border border-dark shadow rounded fs-5" id="deleteButton">Delete</button>
        <div class="d-none" id="saveBtnDiv"></div>
        <button class="w-25 border border-dark shadow rounded fs-5" id="editButton">Edit</button>
        <button class="w-25 border border-dark shadow rounded fs-5 " id="closeButton">Close</button>
    </div>`

    clicked = null;
    load()
}

function saveEvent() {
    if (eventTitleInput.value) {

        eventTitleInput.classList.remove('error')

        let event = {
            title: eventTitleInput.value,
            date: clicked,
            startTime: eventTimeStartInput.value,
            endTime: eventTimeEndInput.value,
            userId: localStorage.getItem('myId')
        }

        const options = {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(event)
        }

        fetch('http://localhost:5000/calendar/save', options).then(res => {
            console.log(res);
            closeModal()
        }).catch(error=>{console.log(error);})

        
    } else {
        eventTitleInput.classList.add('error')
    }
}

function editEvent() {
    document.getElementById('editButton').remove()

    editableModal = document.getElementById('editableModal')
    modalContent = document.getElementById('modalContent')
    saveBtnDiv = document.getElementById('saveBtnDiv')
    modalContent.classList.add('d-none')

    found = events.find(e => e.date == clicked)
    let i = events.indexOf(found)

    editableModal.innerHTML = `<h2 class="mb-4">Edit Event</h2>
        <input value='${events[i].title}' class="p-1 mb-4 rounded border border-dark shadow w-100" id="editEventTitleInput" placeholder="Event Title" required>
        <div class="text-center d-flex flex-column">
            <div>
                Start    <input value='${events[i].startTime}' class="rounded border border-dark p-1 ms-2 mb-4" id="editEventStartTimeInput" type="time">
            </div>
            <div>
                End    <input value='${events[i].endTime}' class="rounded border border-dark p-1 ms-2 mb-4" id="editEventEndTimeInput" type="time">
            </div>
        </div>`
    saveBtnDiv.innerHTML = `<button class="border border-dark shadow rounded fs-5 bg-warning" id="saveBtn">Save</button>`
    saveBtnDiv.classList.remove('d-none')


    document.getElementById('saveBtn').addEventListener('click', () => {
        events[i].title = document.getElementById('editEventTitleInput').value
        events[i].startTime = document.getElementById('editEventStartTimeInput').value
        events[i].endTime = document.getElementById('editEventEndTimeInput').value
        
        let event = {
            eventId: events[i]._id,
            title: events[i].title,
            date: events[i].date,
            startTime: events[i].startTime,
            endTime: events[i].endTime,
            userId: events[i].userId,
        }

        console.log(JSON.stringify(event));

        const options = {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(event)
        }

        fetch('http://localhost:5000/calendar/edit', options).then(res => {
            console.log(res);

            deleteEventModal.innerHTML = `<div id="editableModal"></div>
            <div id="modalContent">
                <h2>Event</h2>
                <p class="fs-5 rounded p-2" id="eventText"> </p>
            </div>
    
            <div class="d-flex justify-content-around">
                <button class="w-25 border border-dark shadow rounded fs-5" id="deleteButton">Delete</button>
                <div class="d-none" id="saveBtnDiv"></div>
                <button class="w-25 border border-dark shadow rounded fs-5" id="editButton">Edit</button>
                <button class="w-25 border border-dark shadow rounded fs-5 " id="closeButton">Close</button>
            </div>`

            closeModal()
        }).catch(error=>{console.log(error);})

    })
}

function newEvent(){
    // document.getElementById('newButton').remove()

    editableModal = document.getElementById('editableModal')
    modalContent = document.getElementById('modalContent')
    saveBtnDiv = document.getElementById('saveBtnDiv')
    modalContent.classList.add('d-none')

    found = events.find(e => e.date == clicked)
    let i = events.indexOf(found)

    editableModal.innerHTML = `<h2 class="mb-4">Edit Event</h2>
        <input value='${events[i].title}' class="p-1 mb-4 rounded border border-dark shadow w-100" id="editEventTitleInput" placeholder="Event Title" required>
        <div class="text-center d-flex flex-column">
            <div>
                Start    <input value='${events[i].startTime}' class="rounded border border-dark p-1 ms-2 mb-4" id="editEventStartTimeInput" type="time">
            </div>
            <div>
                End    <input value='${events[i].endTime}' class="rounded border border-dark p-1 ms-2 mb-4" id="editEventEndTimeInput" type="time">
            </div>
        </div>`
    saveBtnDiv.innerHTML = `<button class="border border-dark shadow rounded fs-5 bg-warning" id="saveBtn">Save</button>`
    saveBtnDiv.classList.remove('d-none')
}

function deleteEventList(date) {
    found = events.find(e => e.date == date)
    let event = {
        eventId: found._id
    }
    const options = {
        method: "DELETE",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(event) 
    }

    fetch('http://localhost:5000/calendar/delete', options).then(res => {
        console.log(res);
        closeModal()
    }).catch(error=>{console.log(error);})
}

function deleteEvent() {
    found = events.find(e => e.date == clicked)
    let event = {
        eventId: found._id
    }
    const options = {
        method: "DELETE",
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(event) 
    }

    fetch('http://localhost:5000/calendar/delete', options).then(res => {
        console.log(res);
        closeModal()
    }).catch(error=>{console.log(error);})
}




