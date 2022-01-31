import React, { Component } from 'react';
import Input from '../components/Input';
import {login} from '../api/apiCalls';
import axios from 'axios';
import ButtonWithProgress from '../components/ButtonWithProgress';
import {Authentication} from '../shared/AuthenticationContext';

class LoginPage extends Component {
    static contextType=Authentication;
state={
    username:null,
    password:null,
    error:null,
    pendingApiCall:false
};

componentDidMount(){
    this.requestInterceptor=axios.interceptors.request.use((request)=>{
    this.setState({ pendingApiCall:true });
    return request;
    });

   this.responseInterceptor=axios.interceptors.response.use(
       response=>{
            this.setState({pendingApiCall:false});
            return response;
       },
       error=>{
       this.setState({pendingApiCall:false});
       throw error;
    }
   );
    }

componentWillUnmount(){
    axios.interceptors.request.eject(this.requestInterceptor);
    axios.interceptors.response.eject(this.responseInterceptor);
}

onChange=event=>{
    const{name,value}=event.target
    this.setState({
        [name]:value,
        error:null //değerleri değişirken statedeki erroru tekrar null yaptık hata yazısı input girince kalksın diye
    });
}; 

onClickLogin=async event=>{
    event.preventDefault();
    const {username,password}=this.state;
    const {onLoginSuccess}=this.context;
    const creds={
        username,
        password
    };

    const {push}=this.props.history;
    this.setState({
        error:null
    });
    try{
        const response=await login(creds);
        push('/');  //logine tıkladıktan sonra doğru ise anasayfaya aktardık.

        const authState={
            ...response.data,
            password:password,
            
        };

        onLoginSuccess(authState);
    }catch(apiError){
        this.setState({
            error:apiError.response.data.message
        });
    }
    
    
};



    render() {
        const {username,password,error,pendingApiCall}=this.state; //this state yazmamıza gerek kalmadı
        const buttonEnabled=username && password;
        

        return (
            <div className='container'>
                <form>
                    <h1 className='text-center'>Login</h1>
                <Input label='Username' name="username" onChange={this.onChange}/>
                <Input label='Password' name="password" type="password" onChange={this.onChange}/>
                {error &&  <div className='alert alert-danger'>{error}</div>}
                <div className='text-center'>
                <ButtonWithProgress 
                onClick={this.onClickLogin} 
                disabled={!buttonEnabled || pendingApiCall}
                pendingApiCall={pendingApiCall}
                text="Login"
                >
                </ButtonWithProgress>
                </div>
                
                </form>
                
            </div>
        );
    }
}

export default LoginPage;