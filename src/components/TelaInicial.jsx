import './TelaInicial.css'

const TelaInicial = ({ startGame }) => {
  return (
    <div className='start'>
      <h1>Mundo secreto</h1>
      <p>Clique no botão abaixo para começar a jogar</p>
      <button onClick={startGame}>Começar o jogo</button>
    </div>
  )
}

export default TelaInicial
