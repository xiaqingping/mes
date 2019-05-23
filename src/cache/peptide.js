import api from '../api';
import peptide from "../api/peptide";
export default {
  purity: [
    {id: 1, value: '30'},
    {id: 2, value: '75'},
    {id: 3, value: '80'},
    {id: 4, value: '85'},
    {id: 5, value: '90'},
    {id: 6, value: '95'},
    {id: 7, value: '98'},
  ],
  modificationsType: [
    {id: 0, value: '全部'},
    {id: 1, value: 'N terminus Modification'},
    {id: 2, value: 'Mid'},
    {id: 3, value: 'D form normal amino acid'},
    {id: 4, value: 'Unusual amino acid'},
    {id: 5, value: 'Methyl amino acids'},
    {id: 6, value: 'Phosphorylation'},
    {id: 7, value: 'Fluorescence/Dye Labeling'},
  ],
  modificationPosition: [
    {id:1, name: '氨基端'},
    {id:2, name: '羧基端'},
    {id:3, name: '中间'},
    {id:4, name: '成环'},
    {id:5, name: '二硫键'}
  ],
}
