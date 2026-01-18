export interface Tag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  orderId: number;
  title?: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
  isPinned?: boolean;
  tags?: Tag[];
}

export type NoteColor = 
  | 'default'
  | 'amber'
  | 'emerald'
  | 'sky'
  | 'violet'
  | 'rose';

export const noteColors: Record<NoteColor, string> = {
  default: 'hsl(220, 15%, 18%)',
  amber: 'hsl(38, 40%, 20%)',
  emerald: 'hsl(160, 30%, 18%)',
  sky: 'hsl(200, 35%, 18%)',
  violet: 'hsl(270, 30%, 20%)',
  rose: 'hsl(350, 30%, 20%)',
};
