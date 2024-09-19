'use client'
let backendUrl ;

const hostname = window && window.location && window.location.hostname;

if( hostname === 'localhost' )
{
  backendUrl="http://135.181.73.248:5000/api"

}
else if( hostname === '127.0.0.1' )
{
    backendUrl="http://135.181.73.248:5000/api"


}
else
{
    backendUrl="http://135.181.73.248:5000/api"


}

export const BackEndUrl = `${backendUrl}`;
