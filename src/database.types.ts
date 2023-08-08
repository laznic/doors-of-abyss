export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      actions: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"];
          chapter_id: number;
          created_at: string | null;
          go_to_chapter_id: number | null;
          id: number;
        };
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"];
          chapter_id: number;
          created_at?: string | null;
          go_to_chapter_id?: number | null;
          id?: number;
        };
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"];
          chapter_id?: number;
          created_at?: string | null;
          go_to_chapter_id?: number | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "actions_chapter_id_fkey";
            columns: ["chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "actions_go_to_chapter_id_fkey";
            columns: ["go_to_chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      chapters: {
        Row: {
          created_at: string | null;
          id: number;
          image: string | null;
          is_last: boolean | null;
          next_chapter_id: number | null;
          text: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          image?: string | null;
          is_last?: boolean | null;
          next_chapter_id?: number | null;
          text?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          image?: string | null;
          is_last?: boolean | null;
          next_chapter_id?: number | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_next_chapter_id_fkey";
            columns: ["next_chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      decisions: {
        Row: {
          chapter_id: number | null;
          created_at: string | null;
          go_to_chapter_id: number | null;
          id: number;
          is_default: boolean;
          used: boolean;
        };
        Insert: {
          chapter_id?: number | null;
          created_at?: string | null;
          go_to_chapter_id?: number | null;
          id?: number;
          is_default?: boolean;
          used?: boolean;
        };
        Update: {
          chapter_id?: number | null;
          created_at?: string | null;
          go_to_chapter_id?: number | null;
          id?: number;
          is_default?: boolean;
          used?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "decisions_chapter_id_fkey";
            columns: ["chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "decisions_go_to_chapter_id_fkey";
            columns: ["go_to_chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      notes: {
        Row: {
          chapter_id: number | null;
          created_at: string | null;
          id: number;
          image: string | null;
          text: string | null;
        };
        Insert: {
          chapter_id?: number | null;
          created_at?: string | null;
          id?: number;
          image?: string | null;
          text?: string | null;
        };
        Update: {
          chapter_id?: number | null;
          created_at?: string | null;
          id?: number;
          image?: string | null;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notes_chapter_id_fkey";
            columns: ["chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      options: {
        Row: {
          chapter_id: number;
          created_at: string | null;
          go_to_chapter_id: number;
          id: number;
          text: string | null;
        };
        Insert: {
          chapter_id: number;
          created_at?: string | null;
          go_to_chapter_id: number;
          id?: number;
          text?: string | null;
        };
        Update: {
          chapter_id?: number;
          created_at?: string | null;
          go_to_chapter_id?: number;
          id?: number;
          text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "options_chapter_id_fkey";
            columns: ["chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "options_go_to_chapter_id_fkey";
            columns: ["go_to_chapter_id"];
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      action_type: "DRAW" | "NOTEBOOK_READ" | "NOTEBOOK_WRITE" | "SHOW_PICTURE";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
