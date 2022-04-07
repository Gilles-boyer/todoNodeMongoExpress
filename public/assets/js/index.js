new Vue({
    el: '#app',
    vuetify: new Vuetify(),

    data: () => ({
        titleModalAddMod: '',
        snackbar: false,
        timeout: 2000,
        text: '',
        dialog: false,
        titleId: "",
        requestOptions: {
            method: 'GET',
            redirect: 'follow'
        },
        titleModalAddMod: "",
        dialog2: false,
        taskLabel: '',
        taskDelete: null,
        funtionValider: null,
        functionDelete: null,
        folders: []
    }),
    created: function() {
        this.StartApp();
    },
    methods: {
        GetAndSetId(id) {
            this.titleId = id;
            return id;
        },

        //set folders with object list task
        StartApp() {
            fetch("/api/task/all", this.requestOptions)
                .then(response => response.json())
                .then(result => this.folders = result)
                .catch(error => console.log('error', error));
        },

        //open Modal and configure for to add new task
        OpenModalAdd() {
            this.titleModalAddMod = 'Ajouter une nouvelle Tache'
            this.dialog = true
            this.funtionValider = () => this.AddNewTask()
        },

        //open Modal and configure for to modify task
        //take 2 parameters (objet task, int index)
        OpenModalModify(task, index) {
            this.titleModalAddMod = 'Modifier une Tache'
            this.dialog = true
            this.taskLabel = task.title
            this.funtionValider = () => this.ModifyTask(index)
        },
        //take 1 params (array tabParams {champs, value})
        //configuration for fetch for post
        //return resquestOptions
        ConfigRequestPost(tabParams = []) {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();

            tabParams.forEach(
                element => urlencoded.append(element.champs, element.value)
            );

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            return requestOptions;
        },

        //add new task in bdd and array Folders
        AddNewTask() {
            var tabParams = [
                { champs: "title", value: this.taskLabel }
            ]

            fetch("/api/task/add", this.ConfigRequestPost(tabParams))
                .then(response => response.json())
                .then(result => this.folders.push(result))
                .catch(error => console.log('error', error));

            this.CleanModalAddModTask()
            this.text = "la tache a été créée"
            this.snackbar = true;
            this.dialog = false
        },

        //modify task with index
        //take parameter (int index)
        ModifyTask(index) {
            this.folders[index].title = this.taskLabel

            var tabParams = [
                { champs: "id", value: this.folders[index]._id },
                { champs: "title", value: this.taskLabel }
            ]

            fetch("/api/task/update", this.ConfigRequestPost(tabParams))
                .then(response => response.json())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            this.text = "la tache a été modifiée"
            this.snackbar = true;
            this.CleanModalAddModTask()
            this.dialog = false
        },

        //Close Modal
        CloseModalAddModTask() {
            this.CleanModalAddModTask()
            this.dialog = false
        },

        //reset modal
        CleanModalAddModTask() {
            this.taskLabel = ''
        },

        //Open Modal Delete and configure Modal
        //take 2 parameters (object task, int index)
        OpenModalDelete(task, index) {
            this.taskDelete = task.title
            this.functionDelete = () => this.DeleteTask(index)
            this.dialog2 = true
        },

        //delete a task with index in bdd and array Folder
        // take 1 parameter (int index)
        DeleteTask(index) {
            fetch(`/api/task/delete/${this.folders[index]._id}`, this.requestOptions)
                .then(response => response.json())
                .then(result => this.folders.splice(index, 1))
                .catch(error => console.log('error', error));

            this.text = "la tache a été supprimée"
            this.snackbar = true;

            this.dialog2 = false
        }
    }
})