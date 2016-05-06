" Vim syntax file
" Language: Runway modelling description language
" Maintainer: Diego Ongaro <ongardie@gmail.com>
" Last Change: Fri May  6 11:13:02 PDT 2016
" Version: 0
"
" Copyright (c) 2015-2016, Salesforce.com, Inc.
" All rights reserved.
" Licensed under the MIT license.
" For full license text, see LICENSE.md file in the repo root or
" https://opensource.org/licenses/MIT

if exists("b:current_syntax")
  finish
endif

syntax case ignore
syn keyword runwayConditional    as
syn keyword runwayStatement      assert
syn keyword runwayRepeat         break
syn keyword runwayRepeat         continue
syn keyword runwayStatement      distribution
syn keyword runwayStructure      either
syn keyword runwayConditional    else
syn keyword runwayStatement      external
syn keyword runwayRepeat         for
syn keyword runwayStatement      function
syn keyword runwayConditional    if
syn keyword runwayRepeat         in
syn keyword runwayStatement      invariant
syn keyword runwayConditional    match
syn keyword runwayStatement      param
syn keyword runwayStatement      print
syn keyword runwayStructure      record
syn keyword runwayRepeat         reset
syn keyword runwayStatement      return
syn keyword runwayStatement      rule
syn keyword runwayStatement      type
syn keyword runwayStatement      var
syn keyword runwayRepeat         while

syn keyword runwayTodo contained fixme
syn keyword runwayTodo contained todo
syn keyword runwayTodo contained xxx

syntax case match

" These are case-sensitive:
syn keyword runwayStructure      Array
syn keyword runwayStructure      Boolean
syn keyword runwayBoolean        False
syn keyword runwayStructure      MultiSet
syn keyword runwayStructure      OrderedSet
syn keyword runwayStructure      Set
syn keyword runwayBoolean        True
syn keyword runwayStructure      Vector
syn keyword runwayFunction       capacity
syn keyword runwayFunction       contains
syn keyword runwayFunction       empty
syn keyword runwayFunction       full
syn keyword runwayFunction       later
syn keyword runwayFunction       past
syn keyword runwayFunction       pop
syn keyword runwayFunction       pow
syn keyword runwayFunction       push
syn keyword runwayFunction       remove
syn keyword runwayFunction       size


" Integers.
syn match runwayNumber "\<\d\+\>"

" Operators and special characters
syn match runwayOperator "[:\+\-\*=<>&|]"
syn match runwayDelimiter "[\.,:]"
syn match runwaySpecial "[{}\(\)\[\]]"

" Comments. This is defined so late so that it overrides previous matches.
syn region runwayComment start="//" end="$" contains=runwayTodo
syn region runwayComment start="/\*" end="\*/" contains=runwayTodo

highlight link runwayComment     Comment
highlight link runwayString      String
highlight link runwayNumber      Number
highlight link runwayBoolean     Boolean
highlight link runwayIdentifier  Identifier
highlight link runwayFunction    Function
highlight link runwayStatement   Statement
highlight link runwayConditional Conditional
highlight link runwayRepeat      Repeat
highlight link runwayLabel       Label
highlight link runwayOperator    Operator
highlight link runwayKeyword     Keyword
highlight link runwayType        Type
highlight link runwayStructure   Structure
highlight link runwaySpecial     Special
highlight link runwayDelimiter   Delimiter
highlight link runwayError       Error
highlight link runwayTodo        Todo

let b:current_syntax = "runway"
