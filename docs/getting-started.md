# Getting Started

## Embed in iframe

You can directly embed Finsquid Auth within your web app using an iframe.

## Integrating iframe

### 1. Configure the URL for the iframe

First you need to get `Auth SDK link` and `api key` from [Finsquid](https://www.finsquid.io/contact). And append the URL parameter `api_key=${key}` to your authentication link.

### 2. Add the URL to an iframe element

Add the `authentication link` as the `src` parameter of an `<iframe>` HTML element.

```js
const AUTH_LINK = authSdkLink + `/?api_key=${apiKey}`
<iframe src={AUTH_LINK} />
```

An iframe will by default be 300px wide and 150px tall. To allow the iframe to seamlessly adapt its size to the containing element, make sure to apply appropriate sizing either by css or inline-styles. Using the width attribute will give the iframe a static width, which is not recommended when targeting mobile devices.

```js
<!–– ❌ not recommended for mobile devices ––>
<iframe src="{AUTH_LINK}" width="400" />

<!–– ✅ adapt to the size of the parent element ––>
<iframe src="{AUTH_LINK}" style="width:100%;" />
```

### 3. Add a listener to your app

All communication between an iframed Tink Link and the parent host is done via postMessage. Register a listener to start receiving messages. How you do this is up to you, but the code below shows the basics.

```js
window.addEventListener("message", handlePostMessage);

const handlePostMessage = (event: any) => {
  if (event.origin !== AUTH_LINK) return;

  const { type, data, error } = JSON.parse(event.data);

  if (type === "success") {
    // This is the provider object that contains sid that should be used in headers for API requests
    console.log(`Auth SDK returned with provider object: ${data}`);
  } else if (type === "error") {
    // Handle error response from Auth SDK
    console.log(
      `Auth SDK returned with error status: ${error.status} and error message: ${error.message}.`
    );
  }
};
```

Also, as with all web development, make sure to take the necessary security precautions. You can read more about `postMessage` [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

### 4. Authenticate and see if it works

Go through the authentication inside the integrated iframe flow. If all is successful, you should receive the provider object.

```js
{
  id: 1,
  name: "nordnet",
  displayName: "Nordnet",
  country: "SWE",
  loginOptions: [{
    loginMethod: "bankid",
    params: [
      {name: "sameDevice", type: "boolean"}
    ],
    iconUrl: "",
  }],
  customer: "Personal",
  providerType: "Neobank",
  iconUrl: "https://gateway-staging.finfollow.com/resources/nordnet.png",
  //You should use this sid in headers for API requests
  sid: "0a2c72e0-9e20-4c99-ac6c-91299623043d",
}
```

## Reference

If you integrate Tink Link in your application via an `iframe`, the result will be delivered as stringified JSON object via `postMessage` to the parent window.