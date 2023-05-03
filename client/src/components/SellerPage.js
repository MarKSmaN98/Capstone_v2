import { UserContext } from "../context/user";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function SellerPage () {
    const {user, setUser} = useContext(UserContext)
    const [sellerProducts, setSellerProducts] = useState([])
    const [showEdit, setShowEdit] = useState(null)
    useEffect(() => {
        if (!user) {
            fetch('/check').then(r => {
                if (r.ok) {
                    return r.json();
                }
                else {
                    <Navigate replace to='/account' />
                }
            })
            .then(body => {
                if (body.account_type == 1) {
                    setUser(body)
                    setSellerProducts(body.sellerItems)
                }
                else {
                    <Navigate replace to='/account' />
                }
            })
        }

    },[])

    if (!user) {
        return (<div>loading...</div>)
    }

    let handleDelete = (product) => {
        fetch(`/items/${product.id}`, {
            method: 'DELETE'
        }).then(r => {
            if (r.ok) {
                let prodIndex = sellerProducts.findIndex((prod) => {
                    return (prod.id == product.id)
                })
                let temp = [...sellerProducts]
                temp.pop(prodIndex)
                user.sellerItems.pop(prodIndex)
                setSellerProducts(temp)
            }
        })
    }

    let handleItemChange = (e, product) => {
        e.preventDefault()
        if (e.target.name.value == '') {e.target.name.value = product.title}
        if (e.target.price.value == '') {e.target.price.value = product.price}
        if (e.target.img.value == '') {e.target.img.value = product.img}
        fetch(`/items/${product.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'title': e.target.name.value,
                'price': e.target.price.value,
                'img': e.target.img.value
            })
        }).then(r => {
            if (r.ok) {
                return r.json()
            }
            else {
                alert('error')
            }
        }).then(body => {
            if (body) {
                let index = sellerProducts.findIndex((prod) => {
                    return (prod.id == product.id)
                })
                let temp = [...sellerProducts]
                temp[index] = body
                user.sellerItems[index] = body
                setSellerProducts(temp)
                //for some reason when deleting an item the new list of items will show that another item was deleted, but the patch went through correctly so reloading
                //will show the right item deleted
            }
        })
        setShowEdit('false')
    }

    let sellerProductCart = user.sellerItems.map((product) => {
        if (showEdit == product.id) {
            return (<div className="productCard" key={`product${product.id}`}>
                <form onSubmit={ (e) => handleItemChange(e, product)} id={product.id}>
                    <h2>Name: <input name='name' placeholder={product.title}></input></h2>
                    <p>Price: <input name='price' placeholder={product.price}></input></p>
                    <p>Image URL: <input name='img' placeholder={product.img}></input></p>
                    <button typ='submit'>Done</button>
                </form>
            </div>
            )}
        else {
            return (
            <div className="productCard" key={`product${product.id}`}>
                <img src={product.img} alt={product.name}></img>
                <h2>{product.title}</h2>
                <p>{product.price}</p>
                <button onClick={() => setShowEdit(product.id)}>Edit</button>
                <button onClick={() => handleDelete(product)}>Delete</button>
                <br></br>
                <br></br>
            </div>)
        }
    })

    return (
        <div className="SellerPage" >
            <div className="CardContainer" >
                {sellerProductCart}
            </div>
        </div>
    )
}

export default SellerPage