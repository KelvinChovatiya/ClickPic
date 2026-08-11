import React from 'react'
import { Show, SignInButton, } from "@clerk/nextjs";


function Home() {
  return (
    <div>
      <Show when="signed-out">
        <SignInButton />
       
      </Show>

    </div>
  )
}

export default Home