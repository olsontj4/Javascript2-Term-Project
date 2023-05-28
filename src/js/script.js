class GenshinTool {
    constructor() {
        this.uiCanvas = document.querySelector("canvas");
        this.context = this.uiCanvas.getContext("2d");
        this.defaultImg = document.querySelector("#defaultImg");
        this.mapImg = document.querySelector("#mapImg");
        this.uiSubmit = document.getElementById("formSubmit");
        this.uiReset = document.getElementById("reset");
        this.uiSelect = document.querySelectorAll("select");
        this.uiSpinner = document.getElementById("loading");

        this.url = "https://api.genshin.dev";
        this.urlExtension = "";

        this.getDatabase = this.getDatabase.bind(this);
        this.getDatabase(0, "");
        this.drawCanvas(this.mapImg, -4524, -914);
    }
    addEventHandlers() {
        this.formSubmit = this.formSubmit.bind(this);
        this.uiSubmit.onclick = this.formSubmit;
        this.uiReset.onclick = this.resetForm;
    }
    getDatabase(index, extension) {
        this.uiSpinner.classList.remove("d-none");
        console.log(index, extension);
        //console.error((this.urlExtension.match(/\/[^ \/]+/g) || []));
        if (extension != "") {
            if ((this.urlExtension.match(/\/[^ \/]+/g) || []).length >= index) {
                console.log("Delete!");
                for (let i = ((this.urlExtension.match(/\/[^ \/]+/g) || []).length); i > index - 1; i--) {
                    let temp = this.urlExtension;
                    temp = temp.replace(this.urlExtension.match(/\/[^ \/]+/g)[i - 1].toString(), "");
                    this.urlExtension = temp;
                }
            }
            this.urlExtension += `/${extension}`;
        }
        console.log(`${this.url}${this.urlExtension}`);
        fetch(`${this.url}${this.urlExtension}`)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                if (index == 3) {
                    this.getImage(data);
                }
                else {
                    this.addEventHandlers();
                    this.loadUiInputs(index, data);
                }
                this.uiSpinner.classList.add("d-none");
            })
            .catch(error => alert(error))
    }
    getImage(data) {
        document.getElementById("preview").src = data;
    }
    loadUiInputs(inputIndex, data) {
        //console.warn(inputIndex, data);
        const thisIndex = inputIndex;
        if (document.getElementById("dropdownMenus").childElementCount > (thisIndex * 2)) {
            for (let i = document.getElementById("dropdownMenus").childElementCount - (thisIndex * 2); i > 0; i--) {
                document.getElementById("dropdownMenus").lastChild.remove();
            }
        }

        const selectTemplate = document.createElement('select');
        selectTemplate.id = `input${thisIndex}`;
        selectTemplate.classList.add('form-control');

        document.querySelector("#dropdownMenus").appendChild(selectTemplate);
        document.querySelector("#dropdownMenus").appendChild(document.createElement('br'));
        /*document.querySelector("#dropdownMenus").innerHTML +=
        `<select id="input${thisIndex}" class="form-control"></select>
        <br>`;*/
        if (thisIndex == 0) {
            const optionDefault = document.createElement('option');
            optionDefault.disabled = true;
            optionDefault.hidden = true;
            optionDefault.selected = true;
            optionDefault.innerHTML = "Select one...";

            document.getElementById(`input${thisIndex}`).appendChild(optionDefault);
            //document.getElementById(`input${thisIndex}`).innerHTML += `<option value="" disabled hidden selected>Select one...</option>`;
            for (let dataValue of data.types) {
                const optionTemplate = document.createElement('option');
                optionTemplate.value = dataValue;
                optionTemplate.innerHTML = dataValue;

                document.getElementById(`input${thisIndex}`).appendChild(optionTemplate);
                document.getElementById(`input${thisIndex}`).onchange = () => {this.getDatabase(thisIndex + 1, document.getElementById(`input${thisIndex}`).value);};
            }
        }
        else if (thisIndex == 1) {
            const optionDefault = document.createElement('option');
            optionDefault.disabled = true;
            optionDefault.hidden = true;
            optionDefault.selected = true;
            optionDefault.innerHTML = "Select one...";
            
            document.getElementById(`input${thisIndex}`).appendChild(optionDefault);

            for (let dataValue of data) {
                const optionTemplate = document.createElement('option');
                optionTemplate.value = dataValue;
                optionTemplate.innerHTML = dataValue;

                document.getElementById(`input${thisIndex}`).appendChild(optionTemplate);
                document.getElementById(`input${thisIndex}`).onchange = () => {this.getDatabase(thisIndex + 1, document.getElementById(`input${thisIndex}`).value);};
            }
        }
        else {
            document.getElementById(`input${thisIndex}`).innerHTML += `<option value="" disabled hidden selected>Select one...</option>`;
            for (let value in data) {
                document.getElementById(`input${thisIndex}`).innerHTML += `<option value="${value}">${value}</option>`;
                document.getElementById(`input${thisIndex}`).onchange = () => {this.getDatabase(3, document.getElementById(`input${thisIndex}`).value);};
            }
        }
        this.uiSelect = document.querySelectorAll("select");
        this.addEventHandlers();
    }
    formSubmit(event) {
        event.preventDefault();
        console.log("Success!");
        main.drawCanvas(this.mapImg, -5000, -1000);
        main.drawMarker();
    }
    drawCanvas(img, x, y) {
        console.error(img);
        //this.context.scale(scale, scale);
        //this.context.drawImage(this.defaultImg, ((this.uiCanvas.width - this.defaultImg.width) / 2), 0);
        this.context.drawImage(img, x + 250, y + 250);
    }
    drawMarker() {
        this.context.drawImage(this.defaultImg, 250, 250);
    }
    resetForm(event) {
        event.preventDefault();
        /*if (document.getElementById("dropdownMenus").childElementCount > (2)) {
            for (let i = document.getElementById("dropdownMenus").childElementCount - (2); i > 0; i--) {
                document.getElementById("dropdownMenus").lastChild.remove();
            }
        }*/
        document.querySelector("#dropdownMenus").innerHTML = "";
        main.urlExtension = "";
        //document.getElementById(`input0`).selectedIndex = 0;
        main.getDatabase(0, "");
        main.drawCanvas(main.mapImg, -4524, -914);
    }
}

let main;
window.onload = () => {main = new GenshinTool();};