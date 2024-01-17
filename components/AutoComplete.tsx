import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={categories}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}


const categories = [
    'Majin Buu Saga'
    ,'Future Saga'
    ,'Universe Survival Saga'
    ,'Shadow Dragon Saga'
    ,'Pure Saiyans'
    ,'Hybrid Saiyans'
    ,'Earthlings'
    ,'Namekians'
    ,'Androids'
    ,'Artificial Life Forms'
    ,"Goku's Family"
    ,"Vegeta's Family"
    ,'Wicked Bloodline'
    ,'Youth'
    ,'Peppy Gals'
    ,'Super Saiyans'
    ,'Super Saiyan 2'
    ,'Super Saiyan 3'
    ,'Power Beyond Super Saiyan'
    ,'Fusion'
    ,'Potara'
    ,'Fused Fighters'
    ,'Giant Form'
    ,'Transformation Boost'
    ,'Power Absorption'
    ,'Kamehameha'
    ,'Realm of Gods'
    ,'Full Power'
    ,'Giant Ape Power'
    ,'Majin Power'
    ,'Powerful Comeback'
    ,'Power of Wishes'
    ,'Miraculous Awakening'
    ,'Corroded Body and Mind'
    ,'Rapid Growth'
    ,'Mastered Evolution'
    ,'Time Limit'
    ,'Final Trump Card'
    ,'Worthy Rivals'
    ,'Sworn Enemies'
    ,'Joined Forces'
    ,'Bond of Parent and Child'
    ,'Siblings Bond'
    ,'Bond of Friendship'
    ,'Bond of Master and Disciple'
    ,'Ginyu Force'
    ,'Team Bardock'
    ,'Universe 6'
    ,'Representatives of Universe 7'
    ,'Universe 11'
    ,'GT Heroes'
    ,'GT Bosses'
    ,'Super Heroes'
    ,'Movie Heroes'
    ,'Movie Bosses'
    ,'Turtle School'
    ,'World Tournament'
    ,'Earth-Bred Fighters'
    ,'Low-Class Warrior'
    ,'Gifted Warriors'
    ,'Otherworld Warriors'
    ,'Resurrected Warriors'
    ,'Space-Traveling Warriors'
    ,'Time Travelers'
    ,'Dragon Ball Seekers'
    ,'Storied Figures'
    ,'Legendary Existence'
    ,'Saviors'
    ,'Defenders of Justice'
    ,'Revenge'
    ,'Target: Goku'
    ,'Terrifying Conquerors'
    ,'Inhuman Deeds'
    ,'Planetary Destruction'
    ,'Exploding Rage'
    ,'Connected Hope'
    ,'Entrusted Will'
    ,'All-Out Struggle'
    ,'Battle of Wits'
    ,'Accelerated Battle'
    ,'Battle of Fate'
    ,'Heavenly Events'
    ,'Special Pose'
    ,'Worldwide Chaos'
    ,'Crossover'
    ,'Dragon Ball Heroes'
  ];