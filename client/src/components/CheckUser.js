import { useContext, useEffect } from "react"
import { Navigate, useNavigate} from "react-router-dom"
import { UserContext } from "../context/user"
function CheckUser ({setIsLogged, toHome}) {
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate(-1)
        }
    }, [user])
    if (user == null)
    {
        fetch('/check').then(r => {
            if (r.ok) {
                return r.json();
            }
            else {
                setIsLogged({
                    'name': 'Guest',
                    'user_carts': [
                        {
                            'name': 'GuestCart',
                            'items': []
                        }
                    ]
                });
                console.log('welcome, guest');
            }
        })
        .then(body => {
            setUser(body);
            setIsLogged(body);
            console.log('checked user', body.name);
            
        })
    }
}

export default CheckUser