function Validator(formSelcetor) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  const formRules = {};

  const validatorRules = {
    required: function (value) {
      return value ? undefined : "Vui lòng nhập trường này!";
    },
    email: function (value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Trường này phải là Email!";
    },
    min: function (min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `Vui lòng nhập ít nhất ${min} ký tự!`;
      };
    },
    // confirm: function (value) {
    //   var form = document.querySelector("#register-form #password").value;
    //   return value === form
    //     ? undefined
    //     : message || `Giá trị nhập vào chưa chính xác!`;
    // },
  };

  //Lấy ra form element trong DOM theo `formSelcetor`
  const formElement = document.querySelector(formSelcetor);

  //Chỉ xử lí khi có elemrnt trong DOM
  if (formElement) {
    const inputs = formElement.querySelectorAll("[name][rules]");
    for (var input of inputs) {
      const rules = input.getAttribute("rules").split("|");

      for (var rule of rules) {
        const ruleHasValue = rule.includes(":");
        var ruleInfo;

        if (ruleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        var ruleFunc = validatorRules[rule];

        if (ruleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        // console.log(rule)
        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      //Lắng nghe event để Validate: blur, change
      input.onblur = handleValidate;
      input.oninput = handleClearValidate;
    }

    //Hàm hiển thị error message
    function handleValidate(e) {
      const rules = formRules[e.target.name];
      var errorMessage;
      for (var rule of rules) {
        errorMessage = rule(e.target.value);
        if (errorMessage) break;
      }
      // console.log(errorMessage)

      //Nếu có lỗi
      if (errorMessage) {
        var formGroup = getParent(e.target, ".form-group");
        if (formGroup) {
          formGroup.classList.add("invalid");
          var formMessage = formGroup.querySelector(".form-message");
          if (formMessage) {
            formMessage.innerText = errorMessage;
          }
        }
      }
      return !errorMessage;
    }

    //Hàm clear error message
    function handleClearValidate(e) {
      var formGroup = getParent(e.target, ".form-group");
      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
        var formMessage = formGroup.querySelector(".form-message");
        if (formMessage) {
          formMessage.innerText = "";
        }
      }
    }
  }

  // console.log(formRules)

  //Xử lí submit form
  formElement.onsubmit = (e) => {
    // e.preventDefault();

    const inputs = formElement.querySelectorAll("[name][rules]");
    var isValid = true;

    for (var input of inputs) {
      if (!handleValidate({ target: input })) {
        isValid = false;
      }
    }

    //Khi không có lỗi --> submit form
    if (isValid) {
      if (typeof this.onSubmit === "function") {
        var enableInputs = formElement.querySelectorAll(
          "[name]:not([disabled])"
        );

        var formValues = Array.from(enableInputs).reduce((values, input) => {
          switch (input.type) {
            case "radio":
              values[input.name] = formElement.querySelector(
                'input[name="' + input.name + '"]:checked'
              ).value;
              break;
            case "checkbox":
              if (!input.matches(":checked")) return values;
              if (!Array.isArray(values[input.name])) {
                values[input.name] = [];
              }
              values[input.name].push(input.value);
              break;
            case "file":
              values[input.name] = input.files;
              break;
            default:
              values[input.name] = input.value;
          }
          return values;
        }, {});

        this.onSubmit(formValues);
      } else {
        formElement.submit();
      }
    }
  };
}
