 const computerchoiseDisplay= document.getElementById('computer-choise');
 const playerchoiseDisplay=document.getElementById('player-choise');
 const sonucDisplay=document.getElementById('sonuc');

 const possibleChoices=document.querySelectorAll('button');

let playerchoise;
let computerchoise;
let result;




possibleChoices.forEach(possibleChoise=>possibleChoise.addEventListener('click',(e)=>{
  playerchoise=e.target.id;
  playerchoiseDisplay.innerHTML=playerchoise;
  genaretecomputerchoise();
  getresult();
  document.getElementById('sonuc').innerHTML = result;

 }))
 
function genaretecomputerchoise()
{
  const randomnumber=Math.floor(Math.random()*possibleChoices.length+1);
  if(randomnumber==1)
  {
    computerchoise='tas';
  }
  if(randomnumber==2)
  {
    computerchoise='kagit';
  }
  if(randomnumber==3)
  {
    computerchoise='makas';
  }
  computerchoiseDisplay.innerHTML=computerchoise;
}
function getresult()
{
  if(computerchoise==playerchoise)
  {
    result="BERABERE";
  }
  if(computerchoise=='tas'&&playerchoise=='makas')
  {
    result="MAALESEF KAYBETTİNİZ";
  }
  if(computerchoise=='makas'&&playerchoise=='kagit')
  {
    result="MAALESEF KAYBETTİNİZ";
  }
  if(computerchoise=='kagit'&&playerchoise=='tas')
  {
    result="MAALESEF KAYBETTİNİZ";
  }

  if(computerchoise=='makas'&&playerchoise=='tas')
  {
    result="TEBRİKLER KAZANDINIZ";
  }
  if(computerchoise=='kagit'&&playerchoise=='makas')
  {
    result="TEBRİKLER KAZANDINIZ";
  }
  if(computerchoise=='tas'&&playerchoise=='kagit')
  {
    result="TEBRİKLER KAZANDINIZ";
  }
  return result;
 
}