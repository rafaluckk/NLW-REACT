import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { CaretDown, CaretUp, Check, GameController } from 'phosphor-react';
import { Input } from './Form/Input';

interface Game {
  id: string;
  title: string;
}

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [gameId, setGameId] = useState<string>();
  const [useVoiceChannel, setUseVoiceChannel] = useState(false);

  useEffect(() => {
    // fetch('http://localhost:3333/games')
    // .then(response => response.json())
    // .then(data => setGames(data));

    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data);
    });
  }, []);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    //validação

    if(!data.name) {
      return;
    }

    try {
      await axios.post(`http://localhost:3333/games/${gameId}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel
      });

      alert('Anúncio criado com sucesso!');
    } catch(err) {
      console.log(err);
      alert('Erro ao criar o anúncio :(');
    }
  }

  return (
    <Dialog.Portal className="overflow-y-scroll">
      <Dialog.Overlay className="bg-black/60 inset-0 fixed"/>

      <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">Qual o game?</label>
            <Select.Root
              onValueChange={setGameId}
            >
              <Select.Trigger 
                className="bg-zinc-900 text-sm flex justify-between items-center py-3 px-4 rounded"
              >
                <Select.Value placeholder="Selecione o game que deseja jogar"/>
                <Select.Icon>
                  <CaretDown className="w-4 h-4" />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content>
                  <Select.ScrollUpButton>
                    <CaretUp className="w-4 h-4" />
                  </Select.ScrollUpButton>
                  <Select.Viewport>
                    <Select.Group className="text-white bg-zinc-900 text-sm rounded h-44 overflow-y-scroll">

                      {games.map(game => {
                        return (
                          <Select.Item 
                            className="flex items-center justify-between py-3 pl-5 hover:bg-violet-500  rounded cursor-pointer relative" 
                            value={game.id}
                            key={game.id}
                          >
                            <Select.ItemText>
                              {game.title}
                            </Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex justify-center items-center">
                              <Check className="w-3 h-3 text-emerald-400" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        )
                      })}
                      
                    </Select.Group>

                    <Select.Separator />
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            {/* <select 
              id="game" 
              name="game"
              placeholder="Selecione o game que deseja jogar"
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
              defaultValue=""
            >
              <option disabled>Selecione o game que deseja jogar</option>
              {games.map(game => {
                return <option key={game.id} value={game.id}>{game.title}</option>
              })}
            </select> */}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input id="name" name="name" placeholder="Como te chamam dentro do jogo?" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input id="yearsPlaying" name="yearsPlaying" type="number" placeholder="Tudo bem ser ZERO" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual seu Discord?</label>
              <Input id="discord" name="discord" type="text" placeholder="Usuario#0000" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costuma jogar?</label>
              <ToggleGroup.Root 
                type="multiple" 
                className="grid grid-cols-4 gap-2"
                value={weekDays}
                onValueChange={setWeekDays}
              >
                <ToggleGroup.Item
                  value="0"
                  title="Domingo"
                  className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  title="Segunda"
                  className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="2"
                  title="Terça"
                  className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="3"
                  title="Quarta"
                  className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="4"
                  title="Quinta"
                  className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="5"
                  title="Sexta"
                  className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="6"
                  title="Sábado"
                  className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                >
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">Qual horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input id="hourStart" name="hourStart" type="time" placeholder="De" />
                <Input id="hourEnd" name="hourEnd" type="time" placeholder="Até" />
              </div>
            </div>
          </div>

          <label className="mt-2 flex gap-2 text-sm items-center cursor-pointer">
            <Checkbox.Root 
              className="w-6 h-6 rounded bg-zinc-900 flex justify-center items-center"
              checked={useVoiceChannel}
              onCheckedChange={(checked) => {
                if(checked === true) {
                  setUseVoiceChannel(true);
                } else {
                  setUseVoiceChannel(false);
                }
              }}
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />  
              </Checkbox.Indicator> 
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close 
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Dialog.Close>
            <button 
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600" 
              type="submit"
            >
              {/* <GameController size={24} /> da na msm assim ou linha debaixo */}
              <GameController className="w-6 h-6" />
              Encontrar duo
            </button> 
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}