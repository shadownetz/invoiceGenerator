 // (@ts-check)
 //Function to regulate key input in quantity field
 $(function () {
    $("#noDec").on("keypress keyup blur",function (event) {    
        $(this).val($(this).val().replace(/[^\d].+/, ""));
         if ((event.which < 48 || event.which > 57)) {
             event.preventDefault();
         }
    })
})

var vm = new Vue({
    el: '#invoice-header',
    data: {
        customerNames: ['', 'name', 'user', 'user'],
        clientInfo: [], count:2, quantNo: [null], services: [], descriptions: [], amounts: [],
        show: ['', true], vat: 5, togglePage: true, myDate: new Date().toISOString().slice(0, 10),
        total: [], netTotal: null,warnMsg: "Warning !", inputClass: ['form-control', 'invoice-input'],
        check: null,temp:null
    },
    watch: {
        //watch when value of the amounts and quantity=>quantNo changes so it
        //automatically calculates values
        amounts(newVal) {
            this.sumTotal();
        },
        quantNo() {
            this.forQty();
        }
    },
    computed: {
        //Function to calculate the sumTotal of all totals for each item in invoice
        calcTotal: function () {
            var amntTotal = 0;
            for (var i = 1; i < this.amounts.length; i++){  //will not exec if the amount of each item is empty 
                if (this.show[i] !== null && this.show[i] !== '') { //checks if each item is visible before exec
                    amntTotal += Number(this.total[i])
                } else {
                    continue;
                }
            }
            this.netTotal = parseFloat(amntTotal + (5/100)).toFixed(3)
            return parseFloat(amntTotal + (5/100)).toFixed(3) //returns values in 3 decimal places
        },
    },
    methods: {
        //Increments counts and registers the item as visible in array 'show'
        //when the add button is clicked
        initList: function (x) {
            this.show[x] = true;
            this.count++;
        },
        //When the delete icon is clicked assign a null value to the visiblity
        //of the item in array 'show' with the index of the item passed as parameter
        delDec: function (x) {
        // this.show[x] = null; //non-reactive
            vm.$set(vm.show,x,null)
        },
    //    When the 'generate' button is clicked, function validates and toggles page 
        switchPage: function () {
            this.validateInput(); //calling function 'validateInput' validates required inputs
            if (this.check) { // if there are no errors i.e when 'check' variable is set to true
                this.togglePage = false; //toggles the generated invoice page
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var date = this.myDate;
                year = date.slice(0, 4); //gets only the year
                month = months[date.slice(5, 7) - 1]; //assigns the month number value to its String rep in 'months' array
                day = date.slice(8)
                this.myDate = day + " " + month + " " + year;
                this.count = 0; //resets 'count' to zero in order to recount new item to show in table
                for (var i = 1; i < this.show.length; i++) { // displays all visible items with their respective data
                    if (this.show[i] !== null || this.show[i] !== "") { //count all visible items
                        this.count++;
                    } else {
                        continue
                    }
                }
                setTimeout(function(){window.print()},1000)
            }
        },
        //calcuate total of all visible item
        sumTotal: function () {
            for (var i = 1; i < this.amounts.length; i++){
                if (this.show[i] !== null && this.show[i] !== '') { //if item is visible
                    if (this.quantNo[i] !== " " && this.quantNo[i] != null) { //if the quantity value is not empty
                        if (this.quantNo[i] == 0) { this.quantNo[i] = 1 }   //if the quantity value is 0 assign default value '1'
                        var total = (this.quantNo[i] * this.amounts[i]).toFixed(3) //assigns total value in 3 decimal places
                        vm.$set(vm.total, i, total) //assigns result to 'total' array with the item's index
                    } else {
                        this.total[i] = this.amounts[i] //if quantity is 0 sets the total to the amount value
                    }
                }
            }
        },
        //exec when quantity value changes
        forQty: function () {
            
            for (var i = 1; i < this.amounts.length; i++) {
                if (this.show[i] !== null && this.show[i] !== '') {
                    if (this.amounts[i] !== " " || this.amounts[i] != null) {
                        if (this.quantNo[i] <= 0) {
                            this.temp = 1
                            var total = (this.temp * this.amounts[i]).toFixed(3)
                        vm.$set(vm.total, i, total)
                        } else {
                        var total = (this.quantNo[i] * this.amounts[i]).toFixed(3)
                        vm.$set(vm.total, i, total)
                        }
                    }
                    if (this.quantNo[i] == "" || this.quantNo[i] == null) {
                        vm.$set(vm.total, i, this.amounts[i])
                    }
                }
            }
        },
        //function validates required inputs
        validateInput: function () {
            for (var i = 1; i < this.show.length; i++){
                var service = '#service'+i //dynamically get id of of all service input fields
                var descp = '#descp' + i  //dynamically get id of of all description input fields
                var noDeci = '#noDeci' + i  //dynamically get id of of all amount input fields
                if (this.clientInfo[0] == null || this.clientInfo[0] == "") { //if client name is empty
                    $('.warn').fadeIn('slow') //display error message
                    this.check = false  //sets 'check' value to false indicating that there is error
                    this.warnMsg = "Client name cannot be blank" //assigns warning mesg to variable 'warnMsg'
                    $('#client').addClass("err") //add error css class
                    break
                } else {
                    this.check = true
                    $('#client').removeClass("err")
                }
                if (this.clientInfo[1] == null || this.clientInfo[1] == "") {   //if client phone number is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    this.warnMsg = "Phone number cannot be blank"
                    $('#phone').addClass("err")
                    break
                } else {
                    this.check = true
                    $('#phone').removeClass("err")
                }
                if (this.myDate == null || this.myDate == "") { //if date is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    this.warnMsg = "Date cannot be blank"
                    $('#datePicker').addClass("err")
                    break
                } else {
                    this.check = true
                    $('#datePicker').removeClass("err")
                }
                if (this.clientInfo[2] == null || this.clientInfo[2] == "") { //if invoice number is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    this.warnMsg = "Invoice number cannot be blank"
                    $('#invoiceNo').addClass("err")
                    break
                } else {
                    this.check = true
                    $('#invoiceNo').removeClass("err")
                }
                if (this.clientInfo[3] == null || this.clientInfo[3] == "") {   //if payment terms is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    this.warnMsg = "Terms cannot be blank"
                    $('#terms').addClass("err")
                    break
                } else {
                    this.check = true
                    $('#terms').removeClass("err")
                }
                if (this.services[i] == null || this.services[i] == "") { //if service field is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    this.warnMsg = "fill in the required fields"
                    $(service).addClass("err")
                } else{
                    this.check = true
                    $(service).removeClass("err")
                }
                if (this.descriptions[i] == null || this.descriptions[i] == "") { //if description field is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    $(descp).addClass("err")
                } else{
                    this.check = true
                    $(descp).removeClass("err")
                }
                if (this.amounts[i] == null || this.amounts[i] == "") {     //if amount field is empty
                    $('.warn').fadeIn('slow')
                    this.check = false
                    $(noDeci).addClass("err")
                } else{
                    this.check = true
                    $(noDeci).removeClass("err")
                } 

                if(this.check){ //if no error remove error message
                    $('.warn').fadeOut('slow')
                    }
            }
        }
    },

})


