import React from 'react';
import {withRouter} from 'react-router-dom';
import { Authentication } from '../shared/AuthenticationContext';

const ProfileCard = props => {
return(
    <Authentication>
        {value=>{
            const pathUserName=props.match.params.username;
            const loggedInUsername=value.state.username;
            let message='We can not edit';
            if(pathUserName===loggedInUsername){
                message='We can edit';
            }
            return<div>  {message}  </div>;
        }
            
        }
    </Authentication>
) 
};

export default withRouter(ProfileCard);