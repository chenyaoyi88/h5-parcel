var oBtnSubmit = document.getElementById('submit');
var oModal = document.getElementById('modal');
var oPhone = document.getElementById('phone');

oBtnSubmit.addEventListener('click', function () {
    if (!/\S/.test(oPhone.value)) {
        toast('请输入您的电话号码');
    }
});

ajax({
    url: 'http://127.0.0.1:4000/test_post',
    type: 'POST',
    data: {
        name: 'cyy',
        age: 18
    },
    header: {
        token: '123123'
    }
    // timeout: 2000
    // success: function (data) {
    //     console.log(data);
    // },
    // error: function (err) {
    //     console.log(err);
    // }
})
.then((data) => {
    console.log(data);
})
.catch((err) => {
    console.warn(err);
});