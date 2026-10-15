import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

const socket = io('https://sesli-hobi-server.onrender.com')

const ODALAR = ['Muhabbet', 'Oyun', 'Müzik', 'Ders', 'Gece Tayfası']

export default function App(){
  const [nick, setNick] = useState('')
  const [joined, setJoined] = useState(false)
  const [oda, setOda] = useState('Muhabbet')
  const [users, setUsers] = useState([])
  const [muted, setMuted] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const localStream = useRef(null)

  useEffect(()=>{
    socket.on('users', (u)=> setUsers(u))
    return ()=> socket.off('users')
  }, [])

  const join = async () => {
    if(!nick) return alert('İsim yaz kral')
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    localStream.current = stream
    setJoined(true)
    socket.emit('join', { nick, oda })
  }

  const toggleMute = () => {
    if(localStream.current){
      localStream.current.getAudioTracks()[0].enabled =!localStream.current.getAudioTracks()[0].enabled
      setMuted(!muted)
    }
  }

  if(!joined) return (
    <div style={{padding:20, maxWidth:400, margin:'50px auto', background:'#111', color:'#fff', borderRadius:12}}>
      <h2>🎙️ Sesli Hobi</h2>
      <input placeholder="Nick'in" value={nick} onChange={e=>setNick(e.target.value)} style={{width:'100%', padding:10, marginTop:10}}/>
      <select value={oda} onChange={e=>setOda(e.target.value)} style={{width:'100%', padding:10, marginTop:10}}>
        {ODALAR.map(o=> <option key={o}>{o}</option>)}
      </select>
      <button onClick={join} style={{width:'100%', padding:12, marginTop:15, background:'#6c5ce7', color:'#fff', border:0, borderRadius:8}}>Odaya Gir</button>
    </div>
  )

  return (
    <div style={{padding:20, color:'#fff', background:'#0a0a0a', minHeight:'100vh'}}>
      <h3>#{oda} - {nick}</h3>
      <button onClick={toggleMute} style={{padding:10, background: muted? 'red' : '#00b894', border:0, color:'#fff', borderRadius:8}}>
        {muted? '🔇 Sessizsin' : '🎤 Konuşuyorsun'}
      </button>
      <div style={{marginTop:20}}>
        <h4>Odada {users.length} kişi</h4>
        {users.map(u=> <div key={u.id} style={{padding:8, background:'#1e1e1e', marginTop:5, borderRadius:6}}>🟢 {u.nick}</div>)}
      </div>
    </div>
  )
                 }
