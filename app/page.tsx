'use client';

import { useState } from 'react';

const photos = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const pieces = [
  { name:'Caneca Curva', kind:'caneca', price:86, description:'Alça generosa, corpo arredondado e borda delicada. Uma peça para as pausas de todos os dias.' },
  { name:'Vaso Orla', kind:'vaso', price:148, description:'Silhueta larga na base e gargalo aberto. Pensado para um único ramo ou para ficar como escultura.' },
  { name:'Tigela Margem', kind:'tigela', price:112, description:'Formato baixo e amplo, com a curva interna suave. A irregularidade faz parte do desenho.' },
] as const;
const finishes = [
  { name:'Terracota', color:'#a9503a', light:'#dfae8d', dark:'#6a2e25' },
  { name:'Oliva', color:'#5e7147', light:'#b6b583', dark:'#29371b' },
  { name:'Areia', color:'#be9a7b', light:'#efe1c0', dark:'#6d4d35' },
];
type Finish = typeof finishes[number];
type Kind = typeof pieces[number]['kind'];
type CartRow = { key:string; product:number; finish:number; qty:number };
const money = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});

function ObjectArt({kind, finish, id}:{kind:Kind;finish:Finish;id:string}) {
  return <svg viewBox="0 0 660 500" role="img" aria-label={`Ilustração de ${kind} em ${finish.name.toLowerCase()}`} className="object">
    <defs>
      <linearGradient id={`clay-${id}`} x1="0" x2="1" y1="0" y2=".23"><stop stopColor={finish.dark}/><stop offset=".25" stopColor={finish.color}/><stop offset=".51" stopColor={finish.light}/><stop offset=".8" stopColor={finish.color}/><stop offset="1" stopColor={finish.dark}/></linearGradient>
      <linearGradient id={`room-${id}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f8e1bd"/><stop offset="1" stopColor="#bd9b70"/></linearGradient>
      <filter id={`grain-${id}`}><feTurbulence type="fractalNoise" baseFrequency=".42" numOctaves="3" seed="4"/></filter>
      <filter id={`shadow-${id}`}><feGaussianBlur stdDeviation="17"/></filter>
    </defs>
    <rect width="660" height="500" fill={`url(#room-${id})`}/>
    <path d="M0 378h660v122H0z" fill="#dab887"/>
    <path d="M0 370 465 184l195 43v41L0 447z" fill="#f7e5ba" opacity=".39" />
    <ellipse cx="357" cy="407" rx="162" ry="28" fill="#6c4029" opacity=".45" filter={`url(#shadow-${id})`}/>
    <g className="vessel" stroke={finish.dark} strokeWidth="1.1">
      {kind==='caneca' && <>
        <path d="M440 239c110-60 119 91-3 105" fill="none" stroke={finish.dark} strokeWidth="34" />
        <path d="M440 239c110-60 119 91-3 105" fill="none" stroke={finish.color} strokeWidth="24" />
        <path d="M211 190c2 95 17 164 51 191 25 20 132 23 155 0 27-27 37-100 39-191z" fill={`url(#clay-${id})`} />
        <ellipse cx="334" cy="190" rx="123" ry="34" fill={finish.light}/><ellipse cx="334" cy="192" rx="110" ry="25" fill={finish.dark}/>
        <path d="M229 273q104 37 222 2M233 293q105 40 211 7M239 316q98 39 198 5" fill="none" stroke={finish.light} opacity=".6"/>
      </>}
      {kind==='vaso' && <>
        <path d="M277 133c5 67-42 84-67 135-26 57 9 129 105 133 103 5 154-45 137-113-16-63-55-69-66-155z" fill={`url(#clay-${id})`}/>
        <ellipse cx="331" cy="133" rx="55" ry="22" fill={finish.light}/><ellipse cx="331" cy="134" rx="43" ry="14" fill={finish.dark}/>
        <path d="M222 250q96 35 213 2M211 275q107 42 233 5M206 305q135 33 246 2M213 328q121 30 238 0M222 347q112 33 220 0" fill="none" stroke={finish.light} opacity=".7"/>
      </>}
      {kind==='tigela' && <>
        <path d="M158 236c5 78 75 162 173 164 93 0 168-87 172-164z" fill={`url(#clay-${id})`}/>
        <ellipse cx="330" cy="234" rx="172" ry="57" fill={finish.light}/><ellipse cx="330" cy="239" rx="153" ry="45" fill={finish.dark}/>
        <path d="M183 251c34-29 260-32 294 0-64 47-212 51-294 0z" fill={finish.color} stroke="none"/>
        <path d="M179 276q141 69 299 0M193 303q133 68 271-2M212 329q111 56 230 0" fill="none" stroke={finish.light} opacity=".55"/>
      </>}
    </g>
    <rect width="660" height="500" filter={`url(#grain-${id})`} opacity=".15" style={{mixBlendMode:'multiply'}}/>
  </svg>;
}

export default function Page() {
  const [product,setProduct] = useState(0);
  const [finish,setFinish] = useState(0);
  const [cart,setCart] = useState<CartRow[]>([]);
  const [announcement,setAnnouncement] = useState('');
  const picked=pieces[product];
  const qty = cart.reduce((sum,row)=>sum+row.qty,0);
  const total = cart.reduce((sum,row)=>sum+pieces[row.product].price*row.qty,0);
  function addRow(product:number,finish:number) {
    const item=pieces[product];
    const key=`${product}:${finish}`;
    setCart(current=>current.some(row=>row.key===key)?current.map(row=>row.key===key?{...row,qty:row.qty+1}:row):[...current,{key,product,finish,qty:1}]);
    setAnnouncement(`Adicionado: ${item.name}, acabamento ${finishes[finish].name}.`);
  }
  function remove(key:string) {
    setCart(current=>current.flatMap(row => row.key!==key?[row]:row.qty===1?[]:[{...row,qty:row.qty-1}]));
    setAnnouncement('Uma unidade foi removida da sacola demonstrativa.');
  }
  return <>
    <a className="skip" href="#conteudo">Pular para o conteúdo</a>
    <div className="concept">ATELIÊ FICTÍCIO · PROJETO CONCEITUAL DE PORTFÓLIO</div>
    <header className="frame"><a href="#inicio" className="logo">casa <i>argila</i></a><nav aria-label="Menu principal"><a href="#colecao">Coleção</a><a href="#sacola">Sacola ({qty})</a></nav></header>
    <main id="conteudo" tabIndex={-1}>
      <section className="hero frame" id="inicio">
        <div className="copy"><p className="eyebrow">COLEÇÃO FORMA DO DIA</p><h1>Terra feita <i>objeto.</i></h1><p className="lead">Texturas de terra, curvas sem pressa. Uma coleção imaginada para o ritual de todos os dias.</p><a className="primary" href="#colecao">Explorar a coleção</a></div>
        <figure className="cover"><img src={photos+'/hero.webp'} alt="Canecas artesanais agrupadas sobre uma superfície de madeira" width="1200" height="900" fetchPriority="high"/><figcaption>REFERÊNCIA VISUAL · CERÂMICA ARTESANAL</figcaption></figure>
      </section>
      <section className="catalog" id="colecao">
        <div className="frame">
          <p className="eyebrow">VITRINE INTERATIVA</p><h2>Poucas peças, muitas formas.</h2>
          <div className="pieces" role="group" aria-label="Escolher peça">{pieces.map((item,index)=><button key={item.kind} aria-pressed={index===product} onClick={()=>setProduct(index)}>{item.name}</button>)}</div>
          <div className="detailed">
            <div className="product-image" key={`${product}:${finish}`}><ObjectArt kind={picked.kind} finish={finishes[finish]} id="product"/></div>
            <div className="product-copy"><p className="eyebrow">SÉRIE CERÂMICA</p><h3>{picked.name}</h3><p className="description">{picked.description}</p><p className="price">{money.format(picked.price)}</p>
              <p id="finish-label" className="finish-label">Acabamento: <b>{finishes[finish].name}</b></p>
              <div className="finishes" role="group" aria-labelledby="finish-label">{finishes.map((item,index)=><button title={item.name} aria-label={item.name} aria-pressed={finish===index} key={item.name} onClick={()=>setFinish(index)} style={{backgroundColor:item.color}} />)}</div>
              <button className="primary" onClick={()=>addRow(product,finish)}>Adicionar à sacola</button><p className="small">Demonstração sem pagamento ou cadastro.</p><p className="sr-only" role="status">{announcement}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="atelier frame" id="atelie"><figure className="materials"><img src={photos+'/editorial.webp'} alt="Pilha de pratos e tigelas cerâmicas sobre uma mesa de madeira" width="1100" height="733" loading="lazy"/><figcaption>Formas utilitárias · fotografia de referência</figcaption></figure><div><p className="eyebrow">DO BARRO À PEÇA</p><h2>Feita de gesto e matéria.</h2><p>Imaginamos a Casa Argila como um pequeno ateliê de formas utilitárias e superfícies táteis, com tons inspirados no barro, na folha e na areia.</p><details><summary>O que muda com o acabamento?</summary><p>A silhueta é a mesma. A variação troca a paleta da peça e aparece separadamente na sacola.</p></details><details><summary>As peças da vitrine são reais?</summary><p>Não. As imagens da vitrine são ilustrações em SVG. A foto editorial representa a atmosfera do conceito, não um catálogo real.</p></details></div></section>
      <section className="basket frame" id="sacola"><h2>Sua sacola.</h2>{cart.length===0?<p>Nenhuma peça adicionada.</p>:<ul>{cart.map(row=><li key={row.key}><div><b>{pieces[row.product].name}</b><span>{finishes[row.finish].name} · {row.qty} {row.qty===1?'unidade':'unidades'}</span></div><div className="cart-right"><b>{money.format(pieces[row.product].price*row.qty)}</b><div className="quantity" role="group" aria-label={`Quantidade de ${pieces[row.product].name}, acabamento ${finishes[row.finish].name}`}><button type="button" aria-label={`Remover uma unidade de ${pieces[row.product].name}, ${finishes[row.finish].name}`} onClick={()=>remove(row.key)}>−</button><button type="button" aria-label={`Adicionar uma unidade de ${pieces[row.product].name}, ${finishes[row.finish].name}`} onClick={()=>addRow(row.product,row.finish)}>+</button></div></div></li>)}</ul>}<p className="subtotal" aria-live="polite">Subtotal simulado <b>{money.format(total)}</b></p></section>
    </main>
    <footer><div className="frame"><b>casa argila</b><p>Marca e preços fictícios. Nenhum pedido é enviado, e nenhuma informação pessoal é solicitada.</p><a href="#inicio">Voltar ao início</a></div></footer>
  </>;
}
