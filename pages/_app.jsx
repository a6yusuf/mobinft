import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.scss";
import "../styles/app.scss";
import "../styles/elements.scss";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { wrapper, store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import cookie from 'js-cookie';
import Axios from "../helpers/axios"
import { useRouter } from 'next/router';
import { login } from "../store/actions/AuthAction";
import { MoralisProvider } from "react-moralis";


function MyApp({ Component, pageProps }) {
  const pageLayout = Component.layout || ((page) => page);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  const appId = process.env.NEXT_PUBLIC_APP_ID

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap");
  }, []);

  const dispatch = useDispatch()

  const [user, setUser] = useState(null)
  let token = cookie.get('token'); 
  const router = useRouter()


  useEffect(() => {
    /**
     * Here goes the logic of retrieving a user
     * from the backend and redirecting
     * an unauthorized user
     * to the login page
     */
    if(token){
          const headers = {
            "Authorization" : `Bearer ${ token }`
          };

        Axios( {
            method:'get',
            url: 'me',
            data: JSON.stringify({}),
            headers: headers,
        } )
        .then(res => {
          dispatch(login(res.data))
          // console.log("Res: ")
        })
        .catch(err => {
          // console.log("errr: ", err)
          router.push('/login')
        })
        ;

    } else {
        router.push('/login')
    }

    // setUser(result)
  }, [])

  if (pageProps.protected && !user) {
    return <div>Loading...</div>
  }

  return pageLayout(
    <>
      {/* Google Analytics */}
      <Script
        id="google-anaylics1"
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-S0XHMQLS64"
      ></Script>

      <Script id="google-anaylics2" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-S0XHMQLS64');
        `}
      </Script>
      <Provider store={store}>
        <MoralisProvider serverUrl={serverUrl} appId={appId}>
          <Component {...pageProps} />
        </MoralisProvider>
      </Provider>
    </>
  );
}

// export default MyApp;
export default wrapper.withRedux(MyApp);