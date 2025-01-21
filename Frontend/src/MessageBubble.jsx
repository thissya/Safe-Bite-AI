import { useUser } from "./Context"

const UserInputBubble = ({user}) => {
  const {userInfo} = useUser();
  return(
    <>
      <div className="max-w-[70%] ml-auto">
        <div className="text-right mb-10 p-2 bg-slate-400 rounded-lg"> {/* Updated color */}
          <div className="font-bold text-left text-gray-800">{userInfo.name}</div> {/* Updated text color */}
          {user.image && <img className="h-40 w-50" src={user.image}/>}
          {user.message}
        </div>
      </div>
    </>
  )
}

const BotMessageBubble = ({bot}) => {
  return(
    <>
      <div className="max-w-[60%] mr-auto">
        <pre className="text-left mb-10 bg-slate-300 rounded-lg p-2 text-wrap" /* Updated color */
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
          <div className="text-left font-bold text-gray-800">Safe Bite AI</div> {/* Updated text color */}
          {bot.message}
        </pre>
      </div>
    </>
  )
}

export {
  UserInputBubble,
  BotMessageBubble
}
