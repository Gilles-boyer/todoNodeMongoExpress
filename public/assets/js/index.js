new Vue({
    el: '#app',
    vuetify: new Vuetify(),

    data: () => ({
        titleModalAddMod: '',
        inputNewPriority: false,
        itemsFolder: [],
        inputPriority: null,
        itemsFolderSelected: null,
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
        test() {
            console.log(this.itemsFolderSelected)
        },
        //set folders with object list task
        StartApp() {
            fetch("/api/priority/all", this.requestOptions)
                .then(response => response.json())
                .then(result => this.itemsFolder = this.folders = result)
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
        OpenModalModify(task, index, indexFolder) {
            this.titleModalAddMod = 'Modifier une Tache'
            this.dialog = true
            this.taskLabel = task.title
            this.funtionValider = () => this.ModifyTask(index, indexFolder)
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

            if (this.itemsFolderSelected != null) {
                tabParams.push({ champs: "priorityId", value: this.itemsFolderSelected.id })
            } else {
                if (this.inputPriority != null) {
                    this.AddNewPriorityBdd(this.ConfigRequestPost([{ champs: "label", value: this.inputPriority }]))
                        .then(res => { console.log(res.id) });
                }
            }

            //function pour récupérer index dans un array (a faire)

            this.AddNewTaskBdd(this.ConfigRequestPost(tabParams), this.itemsFolderSelected);

            this.CleanModalAddModTask()
            this.text = "la tache a été créée"
            this.snackbar = true;
            this.dialog = false
        },

        //add new priority in bdd
        async AddNewPriorityBdd(requestOptions) {
            var res = await fetch("/api/priority/add", requestOptions);
            res = await res.json();
            return res;
        },

        //add new priority in bdd
        async AddNewTaskBdd(requestOptions, folders) {
            var res = await fetch("/api/task/add", requestOptions)
            let index = this.folders.indexOf(folders);
            if (index >= 0) {
                res = await res.json()
                this.folders[index].tasks.push(res)
            } else {
                this.StartApp();
            }
        },

        //modify task with index
        //take parameter (int index)
        ModifyTask(index, indexFolder) {
            this.folders[indexFolder].tasks[index].title = this.taskLabel
            var tabParams = [
                { champs: "id", value: this.folders[indexFolder].tasks[index]._id },
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
            this.inputPriority = null
            this.itemsFolderSelected = null
        },

        //Open Modal Delete and configure Modal
        //take 2 parameters (object task, int index)
        OpenModalDelete(task, index, indexFolder) {
            this.taskDelete = task.title;
            this.functionDelete = () => this.DeleteTask(index, indexFolder);
            this.dialog2 = true;
        },

        //delete a task with index in bdd and array Folder
        // take 1 parameter (int index)
        DeleteTask(index, indexFolder) {
            fetch(`/api/task/delete/${this.folders[indexFolder].tasks[index]._id}`, this.requestOptions)
                .then(response => response.json())
                .then(result => this.folders[indexFolder].tasks.splice(index, 1))
                .catch(error => console.log('error', error));

            this.text = "la tache a été supprimée"
            this.snackbar = true;

            this.dialog2 = false
        }
    }
})