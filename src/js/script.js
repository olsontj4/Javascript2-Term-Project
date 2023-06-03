import './general';

class GenshinTool {
    constructor() {
        this.uiCanvas = document.querySelector("canvas");
        this.context = this.uiCanvas.getContext("2d");
        this.marker = document.getElementById("marker");
        this.mapImg = document.getElementById("mapImg");
        this.uiSubmit = document.getElementById("formSubmit");
        this.uiNext = document.getElementById("next");
        this.uiReset = document.getElementById("reset");
        this.uiSelect = document.querySelectorAll("select");
        this.uiSpinner = document.getElementById("loading");
        this.uiDescriptionBox = document.getElementById("descriptionBox");
        this.uiSubmitMessage = document.getElementById("submitMessage");

        this.url = "https://api.genshin.dev";
        this.urlExtension = "";

        this.holdData = null;
        this.holdDataBranch = null;
        this.holdJSON = null;

        this.nextIndex = 0;

        this.getCoords = this.getCoords.bind(this);
        this.getCoords();
        this.getDatabase = this.getDatabase.bind(this);
        this.getDatabase(0, "");
        document.getElementById("loadingMap").hidden = true;
        this.uiCanvas.hidden = false;
        this.drawCanvas(this.mapImg, 4524, 914);
        this.uiNext.disabled = true;
        this.uiSubmit.hidden = false;
        this.uiNext.hidden = false;
        this.uiReset.hidden = false;
        this.addEventHandlers();
    }
    addEventHandlers() {
        this.formSubmit = this.formSubmit.bind(this);
        this.findNext = this.findNext.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.uiSubmit.onclick = this.formSubmit;
        this.uiNext.onclick = this.findNext;
        this.uiReset.onclick = this.resetForm;
    }
    getDatabase(index, extension) {
        this.uiSubmitMessage.innerHTML = "&#8203";
        this.uiSpinner.classList.remove("d-none");
        //console.log(index, extension);
        //let extension = extensionParam;
        //extension = extensionParam;
            if (this.holdData != undefined) {
                if (this.holdData[extension] != undefined) { //Data held has a property with the name of the extension.  No API call necessary.
                    this.holdDataBranch = this.holdData[extension];
                    if (typeof(this.holdData[extension]) != 'object' && typeof(this.holdData[extension]) != 'undefined') { //End of object tree.  Loads text instead of input.
                        this.loadItemDescription(this.holdData[extension]);
                        //console.log("Main 1st.");
                        if (document.getElementById("dropdownMenus").childElementCount > (index * 2)) { //Delete select and br elements greater than index.
                            for (let i = document.getElementById("dropdownMenus").childElementCount - (index * 2); i > 0; i--) {
                                document.getElementById("dropdownMenus").lastChild.remove();
                            }
                        }
                    }
                    else {
                        if (this.uiSelect[index - 2] != null) { //Disables inputs in order to not require multiple API calls in a loop.  (I already tried.  Couldn't fix bugs.)
                            this.uiSelect[index - 2].disabled = true;
                            //console.log("Disabled main.");
                            //this.holdData = this.holdDataBranch;
                        }
                        this.uiNext.disabled = true;
                        this.loadUiInputs(index, this.holdData[extension]);
                    }
                    this.uiSpinner.classList.add("d-none");
                    //console.warn(this.holdData, this.holdDataBranch);
                }
                else if (this.holdDataBranch[extension] != undefined) { 
                    if (typeof(this.holdData[extension]) != 'object' && typeof(this.holdData[extension]) != 'undefined') {
                        this.loadItemDescription(this.holdData[extension]);
                        //console.log("Branch 1st.");
                    }
                    else if (typeof(this.holdDataBranch[extension]) != 'object' && typeof(this.holdDataBranch[extension]) != 'undefined') {
                        this.loadItemDescription(this.holdDataBranch[extension]);
                        //console.log("Branch 2nd.");
                    }
                    else {
                        if (this.uiSelect[index - 2] != null) {
                            this.uiSelect[index - 2].disabled = true;
                            //console.log("Disabled branch.");
                            this.holdData = this.holdDataBranch;
                            this.holdDataBranch = this.holdDataBranch[extension];
                        }
                        this.uiNext.disabled = true;
                        this.loadUiInputs(index, this.holdDataBranch);
                    }
                    this.uiSpinner.classList.add("d-none");
                    //console.warn(this.holdData, this.holdDataBranch);
                }
                else {
                    if (extension != "") {
                        if ((this.urlExtension.match(/\/[^ \/]+/g) || []).length >= index) {  //Gets only the necessary number of extensions for the API call.
                            //console.log("Delete!");
                            for (let i = ((this.urlExtension.match(/\/[^ \/]+/g) || []).length); i > index - 1; i--) {
                                let temp = this.urlExtension;
                                temp = temp.replace(this.urlExtension.match(/\/[^ \/]+/g)[i - 1].toString(), "");
                                this.urlExtension = temp;
                            }
                        }
                        this.urlExtension += `/${extension}`;
                    }
                    if (this.uiSelect[index - 2] != null) {
                        this.uiSelect[index - 2].disabled = true;
                    }
                    console.log(`${this.url}${this.urlExtension}`);
                    fetch(`${this.url}${this.urlExtension}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.description != null) {
                                this.loadItemDescription(data.description);
                            }
                            else {
                                this.holdData = data;
                                this.holdDataBranch = data;
                                this.uiNext.disabled = true;
                                this.loadUiInputs(index, data);
                            }
                            this.uiSpinner.classList.add("d-none");
                        })
                        .catch(error => alert(error))
                }
            }
            else { //Duplicate code.
                if (extension != "") {
                    if ((this.urlExtension.match(/\/[^ \/]+/g) || []).length >= index) {
                        //console.log("Delete!");
                        for (let i = ((this.urlExtension.match(/\/[^ \/]+/g) || []).length); i > index - 1; i--) {
                            let temp = this.urlExtension;
                            temp = temp.replace(this.urlExtension.match(/\/[^ \/]+/g)[i - 1].toString(), "");
                            this.urlExtension = temp;
                        }
                    }
                    this.urlExtension += `/${extension}`;
                }
                if (this.uiSelect[index - 2] != null) {
                    this.uiSelect[index - 2].disabled = true;
                }
                console.log(`${this.url}${this.urlExtension}`);
                fetch(`${this.url}${this.urlExtension}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.description != null) {
                            this.loadItemDescription(data.description);
                        }
                        else {
                            this.holdData = data;
                            this.holdDataBranch = data;
                            this.uiNext.disabled = true;
                            this.loadUiInputs(index, data);
                        }
                        this.uiSpinner.classList.add("d-none");
                    })
                    .catch(error => alert(error))
            }
    }
    getCoords() {
        fetch("./assets/data/mapCoords.json")
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                this.holdJSON = data;
            })
        .catch(error => alert(error))
    }
    getImage(data) {
        document.getElementById("preview").src = data;
    }
    loadItemDescription(data) {
        if (this.uiDescriptionBox.firstElementChild != null) {
            this.uiDescriptionBox.firstElementChild.remove();
        }

        const descriptionTemplate = document.createElement('p');
        descriptionTemplate.id = `description`;
        descriptionTemplate.innerHTML = data;

        this.uiDescriptionBox.appendChild(descriptionTemplate);
    }
    loadUiInputs(inputIndex, data) {
        if (this.uiDescriptionBox.firstElementChild != null) {
            this.uiDescriptionBox.firstElementChild.remove();
        }
        //console.warn(inputIndex, data);
        const thisIndex = inputIndex;
        if (document.getElementById("dropdownMenus").childElementCount > (thisIndex * 2)) {
            for (let i = document.getElementById("dropdownMenus").childElementCount - (thisIndex * 2); i > 0; i--) {
                document.getElementById("dropdownMenus").lastChild.remove();
            }
        }

        const selectTemplate = document.createElement('select');
        selectTemplate.id = `input${thisIndex}`;
        selectTemplate.classList.add('form-select');

        document.querySelector("#dropdownMenus").appendChild(selectTemplate);
        document.querySelector("#dropdownMenus").appendChild(document.createElement('br'));
        /*document.querySelector("#dropdownMenus").innerHTML +=
        `<select id="input${thisIndex}" class="form-select"></select>
        <br>`;*/

        const optionDefault = document.createElement('option');
        optionDefault.disabled = true;
        optionDefault.hidden = true;
        optionDefault.selected = true;
        optionDefault.innerHTML = "Select one...";

        document.getElementById(`input${thisIndex}`).appendChild(optionDefault);
        //document.getElementById(`input${thisIndex}`).innerHTML += `<option value="" disabled hidden selected>Select one...</option>`;
        if (thisIndex == 0) {
            for (let dataValue of data.types) {
                const optionTemplate = document.createElement('option');
                optionTemplate.value = dataValue;
                optionTemplate.innerHTML = dataValue;

                document.getElementById(`input${thisIndex}`).appendChild(optionTemplate);
                document.getElementById(`input${thisIndex}`).onchange = () => {this.getDatabase(thisIndex + 1, document.getElementById(`input${thisIndex}`).value);};
            }
        }
        else if (thisIndex == 1) {
            for (let dataValue of data) {
                const optionTemplate = document.createElement('option');
                optionTemplate.value = dataValue;
                optionTemplate.innerHTML = dataValue;

                document.getElementById(`input${thisIndex}`).appendChild(optionTemplate);
                document.getElementById(`input${thisIndex}`).onchange = () => {this.getDatabase(thisIndex + 1, document.getElementById(`input${thisIndex}`).value);};
            }
        }
        else {
            for (let dataKey in data) {
                const optionTemplate = document.createElement('option');
                optionTemplate.value = dataKey;
                optionTemplate.innerHTML = dataKey;

                document.getElementById(`input${thisIndex}`).appendChild(optionTemplate);
                document.getElementById(`input${thisIndex}`).onchange = () => {this.getDatabase(thisIndex + 1, document.getElementById(`input${thisIndex}`).value);};
            }
        }

        this.uiSelect = document.querySelectorAll("select");
    }
    formSubmit(event) {
        this.nextIndex = 0;
        event.preventDefault();
        //console.log("Success!");
        if (document.getElementById(`input0`).selectedIndex == 0) {
            this.uiSubmitMessage.innerHTML = "No item selected."
        }
        else if (document.getElementById(`input0`).value == "characters" || document.getElementById(`input0`).value == "enemies") {
            let submitMessage = `${document.getElementById(`input0`).value} are not items, and do not have a location on this map.`
            this.uiSubmitMessage.innerHTML = submitMessage;
        }
        else {
            let coords = this.searchCoords(0);
            if (coords == null) {
                this.uiSubmitMessage.innerHTML = "Not found."
                this.drawCanvas(this.mapImg, 4524, 914);
            }
            else {
                this.drawCanvas(this.mapImg, coords[0], coords[1]);
                if (coords[2] == null) {
                    this.drawMarker();
                }
                this.uiSubmitMessage.innerHTML = "&#8203";
                this.uiNext.disabled = false;
            }
        }
    }
    findNext(event) {
        this.nextIndex++;
        event.preventDefault();
        //console.log("Success!");
        let coords = this.searchCoords(this.nextIndex);
        if (coords == null) {
            this.uiSubmitMessage.innerHTML = "Not found."
            this.uiNext.disabled = true;
        }
        else {
            this.drawCanvas(this.mapImg, coords[0], coords[1]);
            if (coords[2] == null) {
                this.drawMarker();
            }
        }
    }
    searchCoords(index) {
        if (index > 0) { //Find next.
            const matches = [];
            if (this.holdDataBranch.source != undefined) { //Match location from API data.
                for (let nameOf in this.holdJSON) {
                    if (this.holdDataBranch.source == nameOf || this.holdDataBranch.source == this.holdJSON[nameOf].name) {
                        matches.push(this.holdJSON[nameOf].coords);
                    }
                }
            }
            else if (this.holdData.source != undefined) {
                for (let nameOf in this.holdJSON) {
                    if (this.holdData.source == nameOf || this.holdData.source == this.holdJSON[nameOf].name) {
                        matches.push(this.holdJSON[nameOf].coords);
                    }
                }
            }
            else if (this.holdDataBranch.sources != undefined) {
                for (let nameOf in this.holdJSON) {
                    if (this.holdDataBranch.sources[index] == nameOf || this.holdDataBranch.sources[index] == this.holdJSON[nameOf].name) {
                        matches.push(this.holdJSON[nameOf].coords);
                    }
                }
            }
            else if (this.holdData.sources != undefined) {
                for (let nameOf in this.holdJSON) {
                    if (this.holdData.sources[index] == nameOf || this.holdData.sources[index] == this.holdJSON[nameOf].name) {
                        matches.push(this.holdJSON[nameOf].coords);
                    }
                }
            }
            else {
                for (let i = 1; i * 2 < document.getElementById("dropdownMenus").childElementCount; i++) {
                    for (let nameOf in this.holdJSON) {
                        if (document.getElementById(`input${i}`).value == nameOf) {
                            matches.push(this.holdJSON[nameOf].coords);
                        }
                        else {
                            for (let key in this.holdJSON[nameOf]) {
                                for (let keyValue of this.holdJSON[nameOf][key]) {
                                    if (document.getElementById(`input${i}`).value == keyValue) {
                                        matches.push(this.holdJSON[nameOf].coords);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //console.log(matches[index]);
            return matches[index];
        }
        else {
            if (this.holdDataBranch.source != undefined) { //Match location from API data.
                for (let nameOf in this.holdJSON) {
                    if (this.holdDataBranch.source == nameOf || this.holdDataBranch.source == this.holdJSON[nameOf].name) {
                        return this.holdJSON[nameOf].coords;
                    }
                }
            }
            else if (this.holdData.source != undefined) {
                for (let nameOf in this.holdJSON) {
                    if (this.holdData.source == nameOf || this.holdData.source == this.holdJSON[nameOf].name) {
                        return this.holdJSON[nameOf].coords;
                    }
                }
            }
            else if (this.holdDataBranch.sources != undefined) {
                for (let nameOf in this.holdJSON) {
                    if (this.holdDataBranch.sources[0] == nameOf || this.holdDataBranch.sources[0] == this.holdJSON[nameOf].name) {
                        return this.holdJSON[nameOf].coords;
                    }
                }
            }
            else if (this.holdData.sources != undefined) {
                for (let nameOf in this.holdJSON) {
                    if (this.holdData.sources[0] == nameOf || this.holdData.sources[0] == this.holdJSON[nameOf].name) {
                        return this.holdJSON[nameOf].coords;
                    }
                }
            }
            else {
                for (let i = 1; i * 2 < document.getElementById("dropdownMenus").childElementCount; i++) { //Search each input value starting at second input.
                    for (let nameOf in this.holdJSON) {
                        if (document.getElementById(`input${i}`).value == nameOf) { //Match location directly.
                            return this.holdJSON[nameOf].coords;
                        }
                        else { //Match item at location.
                            for (let key in this.holdJSON[nameOf]) {
                                for (let keyValue of this.holdJSON[nameOf][key]) {
                                    if (document.getElementById(`input${i}`).value == keyValue) {
                                        return this.holdJSON[nameOf].coords;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
    drawCanvas(img, x, y) {
        //this.context.scale(scale, scale);
        //this.context.drawImage(this.marker, ((this.uiCanvas.width - this.marker.width) / 2), 0);
        this.context.drawImage(img, -x + 250, -y + 250);
    }
    drawMarker() {
        this.context.drawImage(this.marker, 250 - 25, 250 - 100);
    }
    resetForm(event) {
        event.preventDefault();
        /*if (document.getElementById("dropdownMenus").childElementCount > (2)) {
            for (let i = document.getElementById("dropdownMenus").childElementCount - (2); i > 0; i--) {
                document.getElementById("dropdownMenus").lastChild.remove();
            }
        }*/
        document.querySelector("#dropdownMenus").innerHTML = "";
        this.urlExtension = "";
        this.nextIndex = 0;
        this.uiNext.disabled = true;
        //document.getElementById(`input0`).selectedIndex = 0;
        this.getDatabase(0, "");
        this.drawCanvas(this.mapImg, 4524, 914);
    }
}

let main;
window.onload = () => {main = new GenshinTool();};