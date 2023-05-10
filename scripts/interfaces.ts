export interface ITemplatesItem {
  group: string;
  icon: string;
  tags: string[];
  path: string;
}

export interface IComponent {
  name: string;
  banner: string;
  description: string;
  data: string;
}

export interface IGroupAnswer {
  description: string;
  count: number;
  name: string;
}

export interface IComponentAnswer {
  name: string;
  description: string;
}

export interface IGroup {
  components: IComponent[];
}
