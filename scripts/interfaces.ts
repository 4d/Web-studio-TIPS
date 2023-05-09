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

export interface IGroup {
  components: IComponent[];
}
