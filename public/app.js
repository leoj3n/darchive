document.addEventListener("DOMContentLoaded", event => {
  const appConfig = new blockstack.AppConfig()
  const userSession = new blockstack.UserSession({ appConfig: appConfig })

  document.getElementById('signin-button').addEventListener('click', event => {
    event.preventDefault()
    userSession.redirectToSignIn()
  })

  document.getElementById('signout-button').addEventListener('click', event => {
    event.preventDefault()
    userSession.signUserOut()
    window.location = window.location.origin
  })

  function showProfile (profile) {
    let person = new blockstack.Person(profile)
    document.getElementById('signin-button').innerHTML = person.name() ? person.name() : "Nameless Person"
    // if(person.avatarUrl()) {
    //   document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    // }
  }

  if (userSession.isUserSignedIn()) {
    const { profile } = userSession.loadUserData()
    showProfile(profile)
  } else if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn().then(userData => {
      window.location = window.location.origin
    })
  }
})
