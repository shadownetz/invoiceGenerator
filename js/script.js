 // (@ts-check)
 $(function () {
    $("#noDec").on("keypress keyup blur",function (event) {    
        $(this).val($(this).val().replace(/[^\d].+/, ""));
         if ((event.which < 48 || event.which > 57)) {
             event.preventDefault();
         }
    })
     $("#noDeci").on("keypress keyup blur",function (event) {    
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
        total: [], warnMsg: "Warning !", inputClass: ['form-control', 'invoice-input'],
        check: null,
    },
    watch: {
        amounts(newVal) {
            this.sumTotal();
        },
        quantNo() {
            this.forQty();
        }
    },
    computed: {
        //Function to calculate the sumTotal of all amount
        calcTotal: function () {
            var amntTotal = 0;
            for (var i = 1; i < this.amounts.length; i++){
                if (this.show[i] !== null && this.show[i] !== '') {
                    amntTotal += Number(this.total[i])
                } else {
                    continue;
                }
            }
            return parseFloat(amntTotal + (5/100)).toFixed(3)
        },
    },
    methods: {
        initList: function (x) {
            this.show[x] = true;
            this.count++;
        },
        delDec: function (x) {
        // this.show[x] = null; //non-reactive
            vm.$set(vm.show,x,null)
        },
        switchPage: function () {
            this.togglePage = false;
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var date = this.myDate;
            year = date.slice(0, 4);
            month = months[date.slice(5, 7) - 1];
            day=  date.slice(8)
            this.myDate = day + " " + month + " " + year;
            this.count = 0;
            for (var i = 1; i < this.show.length; i++){
                if (this.show[i] !== null || this.show[i] !== "") {
                    this.count++;
                } else {
                    continue
                }
            }
        },
        sumTotal: function () {
            
            for (var i = 1; i < this.amounts.length; i++){
                if (this.show[i] !== null && this.show[i] !== '') {
                    if (this.quantNo[i] !== " " && this.quantNo[i] != null) {
                        if (this.quantNo[i] == 0) { this.quantNo[i] = 1 }
                        var total = (this.quantNo[i] * this.amounts[i]).toFixed(3)
                        vm.$set(vm.total, i, total)
                    } else {
                        this.total[i] = this.amounts[i]
                    }
                }
            }
        },
        forQty: function () {
            for (var i = 1; i < this.amounts.length; i++) {
                if (this.show[i] !== null && this.show[i] !== '') {
                    if (this.amounts[i] !== " " || this.amounts[i] != null) {
                        if (this.quantNo[i] <= 0) { this.quantNo[i] = 1 }
                        var total = (this.quantNo[i] * this.amounts[i]).toFixed(3)
                        vm.$set(vm.total, i, total)
                    }
                    if (this.quantNo[i] == "" || this.quantNo[i] == null) {
                        vm.$set(vm.total, i, this.amounts[i])
                    }
                }
            }
        },
        validateInput: function () {
            for (var i = 1; i < this.show.length; i++){
                var service = '#service'+i
                var descp = '#descp' + i
                var noDeci = '#noDeci' + i
                if (this.services[i] == null || this.services[i] == "") {
                    $('.warn').fadeIn('slow')
                    this.check = false
                    this.warnMsg = "fill in the required fields"
                    $(service).addClass("err")
                } else{
                    this.check = true
                    $(service).removeClass("err")
                }
                if (this.descriptions[i] == null || this.descriptions[i] == "") {
                    $('.warn').fadeIn('slow')
                    this.check = false
                    $(descp).addClass("err")
                } else{
                    this.check = true
                    $(descp).removeClass("err")
                }
                if (this.amounts[i] == null || this.amounts[i] == "") {
                    $('.warn').fadeIn('slow')
                    this.check = false
                    $(noDeci).addClass("err")
                } else{
                    this.check = true
                    $(noDeci).removeClass("err")
                } 

                if(this.check){
                    $('.warn').fadeOut('slow')
                    }
            }
        }
    },

})


