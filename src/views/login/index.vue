<script>
import { validUsername } from '@/utils/validate'
// import request from '@/utils/request'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      key: '',
      captchaUrl: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.key = Math.random()
    this.captchaUrl = 'http://localhost:8080/captcha?key=' + this.key
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    changeCaptcha() {
      this.key = Math.random()
      this.captchaUrl = 'http://localhost:8080/captcha?key=' + this.key
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const loginData = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            captcha: this.loginForm.captcha,
            key: this.key
          }
          this.$store.dispatch('user/login', loginData).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
            window.location.reload() // 刷新页面
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Background Management</h3>
      </div>

      <!-- 用户名 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="codeAndButton">
        <!-- 验证码 -->
        <el-form-item prop="captcha" class="captcha">
          <span class="svg-container">
            <svg-icon icon-class="example" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            placeholder="Captcha"
            name="captcha"
            type="text"
            tabindex="1"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />

          <img :src="captchaUrl" class="captchaImg" @click="changeCaptcha">
        </el-form-item>

        <el-button type="info" class="loginButton" :loading="loading" @click.native.prevent="handleLogin">Login</el-button>
      </div>

      <div class="tips">
        <span>username: admin</span>
      </div>

    </el-form>
  </div>

</template>

<style lang="scss">
$bg:#f3a15592;
$light_gray:#ffffff;
$cursor: #d1d1d1;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    font-weight: 800;
  }
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vh;
    height: 100vh;
    background: url('../../assets/dusk.jpg') no-repeat;
    background-size: cover;
    background-position: center;
}

/* reset element-ui css */
.login-container {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

}
</style>

<style lang="scss" scoped>
$bg:#b6783500;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  backdrop-filter: blur(20px);

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 10px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 18px;
    font-weight: 800;
    color: #ffa22084;
    margin-top: 30px;
    margin-right:20px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 36px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 18px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style scoped>
  .login-container{
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-left: 680px;
    width: 55%;
  }

  .codeAndButton{
    display: flex;
    height: 105px;
    width: 100%;
  }

  .captcha{
    display: flex;
    flex-direction: column;
    width: 50%;

  }

  .captchaImg{
    cursor: pointer;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .loginButton {
    background: #C88031;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1.2em;
    font-weight: 800;
    transition: 0.2s;
    box-shadow: 0 0.3em #bf690d;
    text-shadow: 1px 1px #bf690d;
    height: 93px;
    width: 100%;
    margin-left: 10px;
  }

  .loginButton:hover {
    color: #be6404;
    background: #d4914a;
  }

  .loginButton:active {
      transform: translateY(0.1em);
      box-shadow: 0 0.2em #bf690d;
  }

  .loginButton:focus {
    outline: none;
  }

  ::v-deep .el-form-item__error{
    color: rgba(255, 188, 188, 0.832);
    font-weight: bold;
    font-size: 14px;
    position: absolute; /* 使用绝对定位 */
    bottom: -20px; /* 调整位置，使其显示在表单项下方 */
    right: 0;
    white-space: nowrap;
  }
</style>
