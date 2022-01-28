import React, {useState, useEffect} from 'react'
import { requestsAPI } from './../../api/index'

export const Requests = () => {
   const [requests, setRequests] = useState(false)

   useEffect(() => {
      requestsAPI.getRequests()
         .then(res => {
            setRequests(res.data.map(r => r.body))
         })
   }, [])

   return (
      <>
         <div className="requests-page app-page">
            <h1 style={{width: '100%', paddingLeft: '1.5%'}}>Requests</h1>
            {requests && requests.map(r => {
               return (
                  <>
                  <hr />
                  <ul>
                     {
                        Object.keys(r).map(key => {
                           return (
                              <li>{`${key}: ${r[key]}`}</li>
                           )
                        })
                     }
                  </ul>
                  </>
               )
            })}
         </div>
      </>
   ) 
}