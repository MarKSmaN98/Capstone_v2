import { UserContext } from "../context/user";
import { useState, useContext, useEffect} from 'react';
import { Navigate } from "react-router-dom";
function Homepage () {
    const [productList, setProductList] = useState(null)
    const {user, setUser} = useContext(UserContext)
    useEffect(() => {
        fetch('items').then(r => {
            if (r.ok) {
                return r.json()
            }
            else {
                return null
            }
        }).then(body => {
            if (body) {
                setProductList(body)
            }
        })
        if (!user) {
            fetch('/check').then(r => {
                if (r.ok) {
                    return r.json();
                }
                else {
                    setUser({
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
            })
        }

    },[])

    if (!productList) {
        return <>...loading...</>
    }

    document.title="Mark's Site"

    let featureList = []
    for (let i = 0; i < 3; i ++) {
        let index = Math.floor(productList.length * Math.random())
        featureList.push(productList[index])
    }

    let renderFeature = featureList.map(item => {
        return (
            <div className="productCard">
                <img src={item.img} alt={item.title}></img>
                <h2>{item.title}</h2>
            </div>
        )
    })

    return (
        <div className="WelcomePage" >
            <div className="WelcomeBanner" >
            <h1 >{user? `Welcome, ${user.name}` : 'Welcome Guest!'}</h1>
            </div>
            <h2>Today's Featured Products!</h2>
            <div className="FeaturedProducts ">
                {renderFeature}
            </div>
        </div>
    )
}

export default Homepage